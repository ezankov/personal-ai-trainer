import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../core/services/plan.service';
import { CoachMessage } from '../../core/models/plan.model';

@Component({
  selector: 'app-coach',
  imports: [FormsModule],
  template: `
    <div class="coach-page">
      <h1>AI Coach</h1>
      <p class="subtitle">Ask your personal coach anything about your training.</p>

      <div class="chat-container">
        <div class="messages" #messagesEl>
          @if (messages().length === 0) {
            <div class="empty-chat">
              <p>👋 Hi! I'm your AI coach. Ask me about your training plan, workouts, or race preparation.</p>
            </div>
          }
          @for (msg of messages(); track msg.id) {
            <div class="message" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'">
              <div class="bubble">{{ msg.content }}</div>
            </div>
          }
          @if (loading()) {
            <div class="message assistant">
              <div class="bubble typing">Thinking...</div>
            </div>
          }
        </div>

        <div class="input-area">
          <input
            type="text"
            [(ngModel)]="inputText"
            placeholder="Ask your coach..."
            (keydown.enter)="send()"
            [disabled]="loading()"
          />
          <button (click)="send()" [disabled]="loading() || !inputText.trim()">Send</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .coach-page { max-width: 700px; }
    h1 { margin: 0 0 4px; }
    .subtitle { color: #666; margin: 0 0 24px; }
    .chat-container { background: white; border-radius: 16px; display: flex; flex-direction: column; height: 600px; }
    .messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 12px; }
    .empty-chat { text-align: center; color: #888; padding: 40px; }
    .message { display: flex; }
    .message.user { justify-content: flex-end; }
    .message.assistant { justify-content: flex-start; }
    .bubble { max-width: 75%; padding: 12px 16px; border-radius: 16px; line-height: 1.5; font-size: 0.95rem; white-space: pre-wrap; }
    .user .bubble { background: #4f46e5; color: white; border-bottom-right-radius: 4px; }
    .assistant .bubble { background: #f3f4f6; color: #1a1a1a; border-bottom-left-radius: 4px; }
    .typing { color: #888; font-style: italic; }
    .input-area { display: flex; gap: 8px; padding: 16px; border-top: 1px solid #f0f0f0; }
    input { flex: 1; padding: 12px 16px; border: 1px solid #ddd; border-radius: 24px; font-size: 0.95rem; outline: none; }
    input:focus { border-color: #4f46e5; }
    button { background: #4f46e5; color: white; border: none; padding: 12px 20px; border-radius: 24px; cursor: pointer; font-size: 0.9rem; }
    button:disabled { opacity: 0.5; }
  `]
})
export class CoachComponent implements OnInit {
  @ViewChild('messagesEl') messagesEl!: ElementRef;

  messages = signal<CoachMessage[]>([]);
  inputText = '';
  loading = signal(false);

  constructor(private planService: PlanService) {}

  ngOnInit() {
    this.planService.getChatHistory().subscribe({
      next: msgs => this.messages.set(msgs),
      error: () => {}
    });
  }

  send() {
    const text = this.inputText.trim();
    if (!text || this.loading()) return;
    this.inputText = '';
    this.loading.set(true);

    // optimistically add user message
    const tempUserMsg: CoachMessage = { id: 'temp', role: 'user', content: text, createdAt: new Date().toISOString() };
    this.messages.update(msgs => [...msgs, tempUserMsg]);
    this.scrollToBottom();

    this.planService.sendMessage(text).subscribe({
      next: reply => {
        this.messages.update(msgs => [...msgs.filter(m => m.id !== 'temp'), tempUserMsg, reply]);
        this.loading.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.messages.update(msgs => msgs.filter(m => m.id !== 'temp'));
        this.loading.set(false);
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.messagesEl?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
