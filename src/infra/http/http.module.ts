// Modules
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterUserModule } from '../register-user/register-user.module'
import { StorageModule } from '../storage/storage.module'

// Controllers
import { AssignTicketController } from './controllers/assign-ticket.controller'
import { ChangeUserRoleController } from './controllers/change-user-role.controller'
import { CloseTicketController } from './controllers/close-ticket.controller'
import { CommentOnTicketController } from './controllers/comment-on-ticket.controller'
import { DeleteTicketController } from './controllers/delete-ticket.controller'
import { EditTicketController } from './controllers/edit-ticket.controller'
import { FetchCommentsTicketController } from './controllers/fetch-comments-ticket.controller'
import { OpenTicketController } from './controllers/open-ticket.controller'
import { RegisterUserController } from './controllers/register-user.controller'
import { ResolveTicketController } from './controllers/resolve-ticket.controller'
import { StartTicketController } from './controllers/start-ticket.controller'
import { UnassignTicketController } from './controllers/unassign-ticket.controller'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'

// Use Cases
import { AssignTicketUseCase } from '@/domain/support/application/use-cases/assign-ticket'
import { CloseTicketUseCase } from '@/domain/support/application/use-cases/close-ticket'
import { CommentOnTicketUseCase } from '@/domain/support/application/use-cases/comment-on-ticket'
import { DeleteTicketUseCase } from '@/domain/support/application/use-cases/delete-ticket'
import { EditTicketUseCase } from '@/domain/support/application/use-cases/edit-ticket'
import { FetchCommentsTicketUseCase } from '@/domain/support/application/use-cases/fetch-comments-ticket'
import { OpenTicketUseCase } from '@/domain/support/application/use-cases/open-ticket'
import { ResolveTicketUseCase } from '@/domain/support/application/use-cases/resolve-ticket'
import { StartTicketUseCase } from '@/domain/support/application/use-cases/start-ticket'
import { UnassignTicketUseCase } from '@/domain/support/application/use-cases/unassign-ticket'
import { ChangeUserRoleUseCase } from '@/domain/support/application/use-cases/change-user-role'
import { UploadAndCreateAttachmentUseCase } from '@/domain/support/application/use-cases/upload-and-create-attachment'

// Services
import { TicketAssignmentService } from '@/domain/support/enterprise/services/ticket-assignment-service'

@Module({
  imports: [
    DatabaseModule,
    StorageModule,
    RegisterUserModule,
  ],
  controllers: [
    OpenTicketController,
    DeleteTicketController,
    EditTicketController,
    CloseTicketController,
    AssignTicketController,
    UnassignTicketController,
    StartTicketController,
    ResolveTicketController,
    CommentOnTicketController,
    FetchCommentsTicketController,
    UploadAttachmentController,
    RegisterUserController,
    ChangeUserRoleController,
  ],
  providers: [
    OpenTicketUseCase,
    DeleteTicketUseCase,
    EditTicketUseCase,
    CloseTicketUseCase,
    AssignTicketUseCase,
    UnassignTicketUseCase,
    StartTicketUseCase,
    ResolveTicketUseCase,
    CommentOnTicketUseCase,
    FetchCommentsTicketUseCase,
    UploadAndCreateAttachmentUseCase,
    ChangeUserRoleUseCase,
    TicketAssignmentService,
  ],
  exports: [DatabaseModule],
})
export class HttpModule {}
