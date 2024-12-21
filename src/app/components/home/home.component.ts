import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaseService, CaseEntry } from '../../services/case.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DateUtils } from '../../utils/date.utils';

interface NewCaseEntry {
  previousDate: string;
  caseDescription: string;
  courtDescription: string;
  caseStatus: string;
  nextDate: string;
  cdate: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: [
    './styles/container.css',
    './styles/menu.css',
    './styles/forms.css',
    './styles/cards.css',
    './styles/modal.css',
    './styles/responsive.css'
  ]
})
export class HomeComponent implements OnInit {
  selectedDate: string;
  cases: CaseEntry[] = [];
  selectedCase: CaseEntry | null = null;
  showCreateModal = false;
  isSideMenuOpen = false;
  newCase: NewCaseEntry;
  minDateForUpdate: string;

  constructor(
    private caseService: CaseService,
    private authService: AuthService,
    private router: Router,
    private dateUtils: DateUtils
  ) {
    const today = this.dateUtils.getCurrentDate();
    this.minDateForUpdate = this.dateUtils.formatDateForInput(today);
    this.selectedDate = this.dateUtils.formatDateForInput(today);
    this.newCase = this.initializeNewCase();
  }

  ngOnInit() {
    this.searchCases();
  }

  private initializeNewCase(): NewCaseEntry {
    const today = this.dateUtils.getCurrentDate();
    return {
      previousDate: this.dateUtils.formatDateForInput(today),
      caseDescription: '',
      courtDescription: '',
      caseStatus: '',
      cdate: this.dateUtils.formatDateForInput(today),
      nextDate: this.dateUtils.formatDateForInput(today)
    };
  }

  showCreateForm() {
    this.showCreateModal = true;
  }

  onDateChange(date: string) {
    this.selectedDate = date;
  }

  onPreviousDateChange(date: string) {
    this.newCase.previousDate = date;
  }

  onNextDateChange(date: string) {
    this.newCase.nextDate = date;
  }

  onEditNextDateChange(date: string) {
    if (this.selectedCase) {
      this.selectedCase.nextDate = date;
    }
  }


  searchCases() {
    const user = this.authService.getUser();
    if (user) {
      this.caseService.getCases(user.userId, this.selectedDate)
        .subscribe(cases => {
          this.cases = cases;
        });
    }
  }

  createCase() {
    const user = this.authService.getUser();
    if (user) {
      const caseData = {
        userId: user.userId,
        ...this.newCase
      };

      this.caseService.createCase(caseData).then(() => {
        this.showCreateModal = false;
        this.searchCases();
        this.newCase = this.initializeNewCase();
      });
    }
  }

  editCase(caseEntry: CaseEntry) {
    this.selectedCase = { ...caseEntry };
  }

  updateCase() {
    if (this.selectedCase && this.selectedCase.id) {
      const updateData = {
        caseStatus: this.selectedCase.caseStatus,
        nextDate: this.selectedCase.nextDate
      };

      this.caseService.updateCase(this.selectedCase.id, updateData)
        .then(() => {
          this.searchCases();
          this.selectedCase = null;
        });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isSideMenuOpen = false;
  }

  toggleSideMenu() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }
}