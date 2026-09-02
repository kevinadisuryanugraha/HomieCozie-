<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order->load('items.menuItem', 'table');
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('kds-channel'),
            new Channel('pos-channel'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'OrderCreated';
    }
}
