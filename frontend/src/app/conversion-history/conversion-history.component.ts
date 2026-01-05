import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, ConversionHistory } from '../../services/history.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-conversion-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatToolbarModule,
    MatDividerModule,
  ],
  templateUrl: './conversion-history.component.html',
  styleUrl: './conversion-history.component.css',
})
export class ConversionHistoryComponent implements OnInit {
  history: ConversionHistory[] = [];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.history = this.historyService.getHistory();
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all conversion history?')) {
      this.historyService.clearHistory();
      this.history = [];
    }
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
