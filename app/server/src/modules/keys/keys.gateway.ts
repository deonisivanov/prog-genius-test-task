import { OnModuleDestroy, OnModuleInit, UsePipes } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { WsValidationPipe } from '@/common/pipes/ws-validation.pipe';

import { KeySentDto } from './dto';
import { KeysService } from './keys.service';

@UsePipes(new WsValidationPipe())
@WebSocketGateway({ namespace: 'keys' })
export class KeysGateway implements OnModuleInit, OnModuleDestroy {
  @WebSocketServer() server!: Server;
  private updateSub?: Subscription;

  constructor(private readonly keysService: KeysService) {}

  onModuleInit() {
    this.updateSub = this.keysService.onKeyUpdate.subscribe(({ key, count }) => {
      this.server.emit('stats', { key, count });
    });
  }

  onModuleDestroy() {
    this.updateSub?.unsubscribe();
  }

  handleConnection(client: Socket) {
    client.emit('stats', this.keysService.getAll());
  }

  @SubscribeMessage('keypress')
  handleKey(@MessageBody() dto: KeySentDto) {
    this.keysService.increment(dto.key);
  }
}
