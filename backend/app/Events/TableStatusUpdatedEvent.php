<?php

namespace App\Events;

use App\Models\TableItem;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TableStatusUpdatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public TableItem $table;

    public function __construct(TableItem $table)
    {
        $this->table = $table;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('floorplan-channel'),
            new Channel('pos-channel'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'TableStatusUpdated';
    }
}
