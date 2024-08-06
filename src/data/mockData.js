export const mockActivities = [
    { id: 1, beneficiaryId: 'B12345', name: 'John Doe', activityType: 'Food Distribution', date: '2024-08-06', location: 'Bucharest Branch', source: 'Humanity concept store App' },
    { id: 2, beneficiaryId: 'B67890', name: 'Jane Smith', activityType: 'Health Check', date: '2024-08-06', location: 'Bucharest Mobile Clinic', source: 'Easy Medical' },
    { id: 3, beneficiaryId: 'B54321', name: 'Maria Pop', activityType: 'Language Class', date: '2024-08-05', location: 'Constanta Branch', source: 'EspoCRM' },
  ];
  
  export const mockBeneficiary = {
    id: 'B12345', name: 'John Doe', dateOfBirth: '1985-03-15', gender: 'Male', age: 39, nationality: 'Ukrainian',
    familyMembers: [
      { id: 'B12346', name: 'Jane Doe', relation: 'Spouse' },
      { id: 'B12347', name: 'Alice Doe', relation: 'Child' },
    ],
    lastActivity: { type: 'Food Distribution', date: '2024-08-06', location: 'Bucharest Branch' },
  };