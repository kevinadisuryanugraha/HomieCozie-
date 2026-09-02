<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class BackupDatabaseCommand extends Command
{
    protected $signature = 'db:backup';
    protected $description = 'Backup MySQL database homie_cozie_db to storage/app/backups';

    public function handle()
    {
        $this->info('Starting Homie Cozie MySQL database backup...');

        $backupDir = storage_path('app/backups');
        if (!File::isDirectory($backupDir)) {
            File::makeDirectory($backupDir, 0755, true, true);
        }

        $timestamp = date('Y-m-d_His');
        $filename = "homie_cozie_db_backup_{$timestamp}.sql";
        $filePath = "{$backupDir}/{$filename}";

        $dbHost = config('database.connections.mysql.host', '127.0.0.1');
        $dbPort = config('database.connections.mysql.port', '3306');
        $dbName = config('database.connections.mysql.database', 'homie_cozie_db');
        $dbUser = config('database.connections.mysql.username', 'root');
        $dbPass = config('database.connections.mysql.password', '');

        $passArg = !empty($dbPass) ? "-p\"{$dbPass}\"" : "";

        // Run mysqldump command
        $command = "mysqldump -h {$dbHost} -P {$dbPort} -u {$dbUser} {$passArg} {$dbName} > \"{$filePath}\"";
        
        $output = null;
        $resultCode = null;
        exec($command, $output, $resultCode);

        if ($resultCode === 0 && file_exists($filePath) && filesize($filePath) > 0) {
            $sizeKb = round(filesize($filePath) / 1024, 2);
            $this->info("✓ Database backup successfully generated: {$filename} ({$sizeKb} KB)");
            $this->info("Path: {$filePath}");
            return Command::SUCCESS;
        } else {
            // Fallback to PHP-based SQL dump if mysqldump CLI is not in PATH
            $this->warn("mysqldump CLI command failed, attempting PHP Eloquent table dump fallback...");
            $tables = \DB::select('SHOW TABLES');
            $sqlContent = "-- Homie Cozie MySQL Database Backup\n-- Generated at: " . date('Y-m-d H:i:s') . "\n\n";

            foreach ($tables as $t) {
                $tableObj = (array) $t;
                $tableName = reset($tableObj);
                $createTable = \DB::select("SHOW CREATE TABLE `{$tableName}`");
                $createTableArr = (array) $createTable[0];
                $sqlContent .= "DROP TABLE IF EXISTS `{$tableName}`;\n";
                $sqlContent .= $createTableArr['Create Table'] . ";\n\n";

                $rows = \DB::table($tableName)->get();
                foreach ($rows as $row) {
                    $rowArr = (array) $row;
                    $escapedValues = array_map(function ($val) {
                        if (is_null($val)) return 'NULL';
                        return "'" . addslashes((string) $val) . "'";
                    }, array_values($rowArr));
                    $cols = array_keys($rowArr);
                    $sqlContent .= "INSERT INTO `{$tableName}` (`" . implode("`, `", $cols) . "`) VALUES (" . implode(", ", $escapedValues) . ");\n";
                }
                $sqlContent .= "\n";
            }

            File::put($filePath, $sqlContent);
            $sizeKb = round(filesize($filePath) / 1024, 2);
            $this->info("✓ Database fallback backup generated: {$filename} ({$sizeKb} KB)");
            return Command::SUCCESS;
        }
    }
}
