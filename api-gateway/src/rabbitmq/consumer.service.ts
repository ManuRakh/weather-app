import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { EmailService } from '../notification/email.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);
    constructor(private emailService: EmailService, private configService: ConfigService) {
        const host = configService.get<string>('RABBITMQ_URL');
        const connection = amqp.connect([host]);
        this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.configService.get<string>('RABBITMQ_QUEUE'), { durable: true });
        await channel.consume(this.configService.get<string>('RABBITMQ_QUEUE'), async (message) => {
            if (message) {
                const content = JSON.parse(message.content.toString());
                this.chooseCallingService(content)
                channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
    }
    
    async chooseCallingService(content) {
        const { pattern, data } = content;
        
        switch (pattern) {
            case 'notify_user': await this.emailService.sendEmail(data);
                break;
            default:  break;
        }
    }
}
