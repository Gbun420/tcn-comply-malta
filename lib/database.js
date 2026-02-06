// Simple in-memory database for demo purposes
// In production, replace with real database (Firebase, PostgreSQL, etc.)

const Database = {
  users: [
    {
      uid: 'demo-1',
      email: 'bundyglenn@gmail.com',
      password: 'admin123', // In production, use bcrypt
      displayName: 'Glenn Bundy',
      role: 'admin',
      company: 'TCN Comply Malta',
      createdAt: new Date().toISOString(),
    }
  ],
  
  employees: [
    {
      id: 'EMP001',
      name: 'Maria Santos',
      passport: 'PH1234567',
      nationality: 'Philippines',
      status: 'active',
      courseStatus: 'Completed',
      courseCompletionDate: '2024-10-15',
      skillsPassStatus: 'Not Required',
      renewalDate: '2024-12-15',
      position: 'Housekeeping',
      department: 'Operations',
      userId: 'demo-1',
      createdAt: '2024-01-15',
      notes: 'Excellent performance',
    },
    {
      id: 'EMP002',
      name: 'Ahmed Hassan',
      passport: 'EG7654321',
      nationality: 'Egypt',
      status: 'pending',
      courseStatus: 'In Progress',
      courseCompletionDate: null,
      skillsPassStatus: 'Pending',
      renewalDate: '2025-01-20',
      position: 'Kitchen Staff',
      department: 'Food & Beverage',
      userId: 'demo-1',
      createdAt: '2024-02-20',
      notes: 'Waiting for Skills Pass certification',
    },
    {
      id: 'EMP003',
      name: 'Keiko Tanaka',
      passport: 'JP1122334',
      nationality: 'Japan',
      status: 'overdue',
      courseStatus: 'Not Started',
      courseCompletionDate: null,
      skillsPassStatus: 'Not Required',
      renewalDate: '2024-11-30',
      position: 'Front Desk',
      department: 'Reception',
      userId: 'demo-1',
      createdAt: '2024-03-10',
      notes: 'Urgent: Renewal deadline approaching',
    },
    {
      id: 'EMP004',
      name: 'Raj Patel',
      passport: 'IN9988776',
      nationality: 'India',
      status: 'active',
      courseStatus: 'Completed',
      courseCompletionDate: '2024-09-20',
      skillsPassStatus: 'Completed',
      renewalDate: '2025-03-15',
      position: 'Chef',
      department: 'Food & Beverage',
      userId: 'demo-1',
      createdAt: '2024-04-05',
      notes: 'Skills Pass certified for hospitality',
    },
    {
      id: 'EMP005',
      name: 'Sophie Dubois',
      passport: 'FR5544332',
      nationality: 'France',
      status: 'active',
      courseStatus: 'Completed',
      courseCompletionDate: '2024-08-10',
      skillsPassStatus: 'Not Required',
      renewalDate: '2025-02-28',
      position: 'Manager',
      department: 'Administration',
      userId: 'demo-1',
      createdAt: '2024-05-12',
      notes: 'EU citizen - no Skills Pass required',
    }
  ],
  
  complianceTracking: {
    quota: {
      maxEmployees: 50,
      currentEmployees: 24,
      terminationLimit: 5,
      currentTerminations: 2,
      disabilityQuotaRequired: 2, // 2% of 24 = 0.48, rounded to 1
      disabilityQuotaMet: 1,
    },
    vacancies: [
      {
        id: 'VAC001',
        position: 'Housekeeping Staff',
        department: 'Operations',
        postedDate: '2024-10-01',
        jobsplusPosted: true,
        euresPosted: true,
        daysPosted: 25,
        status: 'active',
      },
      {
        id: 'VAC002',
        position: 'Kitchen Assistant',
        department: 'Food & Beverage',
        postedDate: '2024-10-15',
        jobsplusPosted: true,
        euresPosted: false,
        daysPosted: 11,
        status: 'pending',
      }
    ],
    renewals: [
      {
        employeeId: 'EMP003',
        employeeName: 'Keiko Tanaka',
        renewalDate: '2024-11-30',
        daysRemaining: 15,
        status: 'urgent',
        healthScreening: false,
        documentsSubmitted: false,
      },
      {
        employeeId: 'EMP001',
        employeeName: 'Maria Santos',
        renewalDate: '2024-12-15',
        daysRemaining: 30,
        status: 'upcoming',
        healthScreening: true,
        documentsSubmitted: true,
      }
    ]
  },

  // Helper methods
  getUserByEmail(email) {
    return this.users.find(u => u.email === email)
  },

  getEmployeesByUserId(userId) {
    return this.employees.filter(e => e.userId === userId)
  },

  addEmployee(employeeData) {
    const newEmployee = {
      id: `EMP${String(this.employees.length + 1).padStart(3, '0')}`,
      ...employeeData,
      createdAt: new Date().toISOString(),
    }
    this.employees.push(newEmployee)
    return newEmployee
  },

  updateEmployee(id, updates) {
    const index = this.employees.findIndex(e => e.id === id)
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...updates }
      return this.employees[index]
    }
    return null
  },

  deleteEmployee(id) {
    const index = this.employees.findIndex(e => e.id === id)
    if (index !== -1) {
      this.employees.splice(index, 1)
      return true
    }
    return false
  },

  getStats(userId) {
    const employees = this.getEmployeesByUserId(userId)
    const totalEmployees = employees.length
    const coursesCompleted = employees.filter(e => e.courseStatus === 'Completed').length
    const pendingRenewals = employees.filter(e => {
      const renewalDate = new Date(e.renewalDate)
      const today = new Date()
      const diffTime = renewalDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 90 && diffDays > 0
    }).length
    const complianceRate = totalEmployees > 0 
      ? Math.round((employees.filter(e => e.status === 'active').length / totalEmployees) * 100)
      : 0

    return {
      totalEmployees,
      coursesCompleted,
      pendingRenewals,
      complianceRate,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      overdueEmployees: employees.filter(e => e.status === 'overdue').length,
    }
  }
}

export default Database
