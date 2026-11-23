import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  // --- GET SSE STREAM ---
  @Sse('stream')
  stream(
    @Query('role') role?: string,
    @Query('userId') userId?: string,
  ): Observable<MessageEvent> {
    const uId = userId ? parseInt(userId, 10) : undefined;
    return this.notifService.getNotificationStream(role, uId);
  }

  // --- GET NOTIFICATIONS LIST ---
  @Get()
  getNotifications(
    @Query('role') role?: string,
    @Query('userId') userId?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    const uId = userId ? parseInt(userId, 10) : undefined;
    const isUnread = unreadOnly === 'true';
    return this.notifService.getNotifications(role, uId, isUnread);
  }

  // --- GET UNREAD COUNT ---
  @Get('unread-count')
  getUnreadCount(
    @Query('role') role?: string,
    @Query('userId') userId?: string,
  ) {
    const uId = userId ? parseInt(userId, 10) : undefined;
    return this.notifService.getUnreadCount(role, uId);
  }

  // --- MARK ONE AS READ ---
  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.notifService.markAsRead(id);
  }

  // --- MARK ALL AS READ ---
  @Post('mark-all-read')
  markAllAsRead(
    @Body('role') role?: string,
    @Body('userId') userId?: number,
  ) {
    return this.notifService.markAllAsRead(role, userId);
  }

  // --- BROADCAST TEST NOTIFICATION ---
  @Post('broadcast-test')
  broadcastTest(@Body() body: any) {
    return this.notifService.createNotification({
      targetRole: body.role || 'ALL',
      type: body.type || 'SYSTEM',
      titleAr: body.titleAr || 'إشعار فوري تجريبي',
      titleFr: body.titleFr || 'Notification test en temps réel',
      titleEn: body.titleEn || 'Real-time test notification',
      messageAr: body.messageAr || 'هذا تنبيه تجريبي لتأكيد وصول الإشعارات اللحظية بنجاح.',
      messageFr: body.messageFr || 'Ceci est une notification de test en direct.',
      messageEn: body.messageEn || 'This is a live test notification.',
      link: body.link || '/',
      metadata: body.metadata,
    });
  }
}
