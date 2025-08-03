import { OnModuleDestroy, OnModuleInit, UsePipes } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { Server } from 'socket.io';

import { WsValidationPipe } from '@/common/pipes/ws-validation.pipe';

import { KeypressDto } from './dto';
import { KeysService } from './keys.service';

@WebSocketGateway({ namespace: 'keys' })
export class KeysGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer() server!: Server;
  private updateSub?: Subscription;

  constructor(private readonly counter: KeysService) {}

  onModuleInit() {
    this.updateSub = this.counter.onKeyUpdate.subscribe(({ key, count }) => {
      this.server.emit('stats', { key, count });
    });
  }

  onModuleDestroy() {
    this.updateSub?.unsubscribe();
  }

  @SubscribeMessage('keypress')
  @UsePipes(new WsValidationPipe())
  handleKey(@MessageBody() dto: KeypressDto) {
    this.counter.increment(dto.key);
  }
}
