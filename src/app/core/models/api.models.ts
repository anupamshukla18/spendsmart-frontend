/* ═══════════════════════════════════════════════════════════════
   Generic API Response — mirrors backend ApiResponse<T>
   ═══════════════════════════════════════════════════════════════ */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ═══════════════════════════════════════════════════════════════
   Auth Models
   ═══════════════════════════════════════════════════════════════ */
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  currency?: string;
  timezone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export interface UserResponse {
  userId: number;
  fullName: string;
  email: string;
  currency: string;
  timezone: string;
  avatarUrl: string | null;
  bio: string | null;
  provider: string;
  isActive: boolean;
  emailVerified: boolean;
  monthlyBudget: number | null;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  timezone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

/* ═══════════════════════════════════════════════════════════════
   Expense Models
   ═══════════════════════════════════════════════════════════════ */
export interface Expense {
  expenseId: number;
  userId: number;
  categoryId: number;
  title: string;
  amount: number;
  currency: string;
  type: string;
  paymentMethod: string;
  expenseDate: string;
  notes: string | null;
  receiptUrl: string | null;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseRequest {
  title: string;
  amount: number;
  categoryId: number;
  expenseDate: string;
  paymentMethod?: string;
  currency?: string;
  notes?: string;
  type?: string;
  isRecurring?: boolean;
}

export interface UpdateExpenseRequest {
  title?: string;
  amount?: number;
  categoryId?: number;
  expenseDate?: string;
  paymentMethod?: string;
  currency?: string;
  notes?: string;
  type?: string;
  isRecurring?: boolean;
  receiptUrl?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Income Models
   ═══════════════════════════════════════════════════════════════ */
export interface Income {
  incomeId: number;
  userId: number;
  categoryId: number;
  title: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  date: string;
  notes: string | null;
  isRecurring: boolean;
  recurrencePeriod: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeRequest {
  title: string;
  amount: number;
  categoryId: number;
  date: string;
  paymentMethod: string;
  currency: string;
  notes?: string;
  isRecurring?: boolean;
  recurrencePeriod?: string;
}

export interface UpdateIncomeRequest {
  title?: string;
  amount?: number;
  categoryId?: number;
  date?: string;
  paymentMethod?: string;
  currency?: string;
  notes?: string;
  isRecurring?: boolean;
  recurrencePeriod?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Budget Models
   ═══════════════════════════════════════════════════════════════ */
export interface Budget {
  budgetId: number;
  userId: number;
  categoryId: number | null;
  name: string;
  limitAmount: number;
  currency: string;
  period: string;
  startDate: string;
  endDate: string;
  spentAmount: number;
  alertThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetRequest {
  name: string;
  categoryId?: number;
  limitAmount: number;
  currency?: string;
  period?: string;
  startDate: string;
  endDate: string;
  alertThreshold?: number;
}

export interface UpdateBudgetRequest {
  name?: string;
  limitAmount?: number;
  currency?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  alertThreshold?: number;
  isActive?: boolean;
}

export interface BudgetProgress {
  budgetId: number;
  name: string;
  categoryId: number | null;
  limitAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  alertThreshold: number;
  thresholdReached: boolean;
  limitExceeded: boolean;
  period: string;
  startDate: string;
  endDate: string;
}

export interface BudgetAlert {
  budgetId: number;
  budgetName: string;
  categoryId: number | null;
  limitAmount: number;
  spentAmount: number;
  percentageUsed: number;
  alertType: string;
}

/* ═══════════════════════════════════════════════════════════════
   Category Models
   ═══════════════════════════════════════════════════════════════ */
export interface Category {
  categoryId: number;
  userId: number;
  name: string;
  type: string;
  icon: string | null;
  colorCode: string | null;
  budgetLimit: number | null;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  type: string;
  icon?: string;
  colorCode?: string;
  budgetLimit?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
  colorCode?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Analytics Models
   ═══════════════════════════════════════════════════════════════ */
export interface MonthlySummary {
  month: number;
  year: number;
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  budgetUtilisation: number;
  currency: string;
}

export interface YearlySummary {
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  avgSavingsRate: number;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface MonthlyBreakdown {
  month: number;
  monthLabel: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryBreakdownItem {
  categoryId: number;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface IncomeVsExpensePoint {
  year: number;
  month: number;
  label: string;
  income: number;
  expenses: number;
  netSavings: number;
}

export interface DailyTrendPoint {
  date: string;
  amount: number;
  cumulativeAmount: number;
}

export interface SavingsRatePoint {
  year: number;
  month: number;
  label: string;
  savingsRate: number;
}

export interface TopCategoryItem {
  rank: number;
  categoryId: number;
  categoryName: string;
  amount: number;
  percentage: number;
}

export interface CashFlowSummary {
  month: number;
  year: number;
  totalInflow: number;
  totalOutflow: number;
  netCashFlow: number;
  flowStatus: string;
}

export interface SpendingForecast {
  forecastMonth: number;
  forecastYear: number;
  projectedExpenses: number;
  trailingAverage: number;
  momentumFactor: number;
  confidence: string;
}

export interface FinancialHealthScore {
  score: number;
  grade: string;
  savingsScore: number;
  budgetScore: number;
  expenseRatioScore: number;
  savingsRate: number;
  budgetAdherenceRate: number;
  expenseToIncomeRatio: number;
}

/* ═══════════════════════════════════════════════════════════════
   Notification Models
   ═══════════════════════════════════════════════════════════════ */
export interface Notification {
  notificationId: number;
  recipientId: number;
  type: string;
  severity: string;
  title: string;
  message: string;
  relatedId: number | null;
  relatedType: string | null;
  isRead: boolean;
  isAcknowledged: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  recipientId: number;
  unreadCount: number;
}

/* ═══════════════════════════════════════════════════════════════
   Recurring Models
   ═══════════════════════════════════════════════════════════════ */
export interface RecurringTransaction {
  recurringId: number;
  userId: number;
  categoryId: number;
  title: string;
  amount: number;
  currency: string;
  type: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  isActive: boolean;
  description: string | null;
  paymentMethod: string | null;
  incomeSource: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurringRequest {
  title: string;
  amount: number;
  currency?: string;
  categoryId: number;
  type: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  description?: string;
  paymentMethod?: string;
  incomeSource?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Shared Total Response
   ═══════════════════════════════════════════════════════════════ */
export interface TotalResponse {
  total: number;
  currency?: string;
  period?: string;
}

/* ═══════════════════════════════════════════════════════════════
   Payment Models
   ═══════════════════════════════════════════════════════════════ */
export interface CreateOrderRequest {
  amountInPaise: number;
  currency?: string;
  receipt: string;
  description?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amountInPaise: number;
  currency: string;
  status: string;
  receipt: string;
  razorpayKeyId: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentResponse {
  paymentId: number;
  userId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amountInPaise: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
