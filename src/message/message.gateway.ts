import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'messages',
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    client.join(userId);
    return { event: 'joinedRoom', data: userId };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    client.leave(userId);
    return { event: 'leftRoom', data: userId };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@ConnectedSocket() client: Socket, @MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    
    // Émettre le message au destinataire
    this.server.to(createMessageDto.destinataireId).emit('newMessage', message);
    
    return { event: 'messageSent', data: message };
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@ConnectedSocket() client: Socket, @MessageBody() messageId: string) {
    const message = await this.messageService.markAsRead(messageId);
    return { event: 'messageRead', data: message };
  }
}