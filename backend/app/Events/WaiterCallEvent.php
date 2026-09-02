<?php

namespace App\Events;

use App\Models\WaiterCall;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WaiterCallEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public WaiterCall $waiterCall;

    public function __construct(WaiterCall $waiterCall)
    {
        $this->waiterCall = $waiterCall;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('pos-channel'),
            new Channel('kds-channel'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'WaiterCalled';
    }
}
