// Utility function to generate a random date within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Utility function to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Function to create family relationships
const createFamilyRelationships = (beneficiaries) => {
  const familySize = [1, 2, 3, 4, 5]; // Possible family sizes
  let remainingBeneficiaries = [...beneficiaries];

  while (remainingBeneficiaries.length > 0) {
    const size = familySize[Math.floor(Math.random() * familySize.length)];
    const family = remainingBeneficiaries.splice(0, size);
    
    family.forEach((member, index) => {
      if (index === 0) {
        member.familyRole = 'Head of Household';
      } else if (index === 1 && Math.random() > 0.3) {
        member.familyRole = 'Spouse';
      } else {
        member.familyRole = 'Child';
      }
      
      member.familyMembers = family
        .filter(m => m !== member)
        .map(m => ({ id: m.id, name: m.name, relation: m.familyRole }));
    });
  }
};

// Function to generate activities with varied frequency
const generateActivities = (beneficiaries, numActivities) => {
  const activityTypes = [
    'Food Distribution', 
    'Health Consultation', 
    'Language Class', 
    'Cash Assistance', 
    'MHPSS Session', 
    'Livelihood Support'
  ];
  const locations = ['Bucharest Branch', 'Cluj-Napoca Branch', 'Iasi Branch', 'Constanta Branch', 'Mobile Clinic'];
  
  const sourceSystemMap = {
    'Cash Assistance': 'Access RC',
    'Health Consultation': 'Easy Medical',
    'MHPSS Session': 'Easy Medical',
    'Food Distribution': 'Humanity Concept Store',
    'Language Class': 'Excel or Paper Upload',
    'Livelihood Support': 'Excel or Paper Upload'
  };

  const activities = [];
  const activityFrequency = new Array(beneficiaries.length).fill(1).map(() => Math.random() * 2 + 0.5);

  for (let i = 0; i < numActivities; i++) {
    const beneficiaryIndex = Math.floor(Math.pow(Math.random(), activityFrequency[Math.floor(Math.random() * activityFrequency.length)]) * beneficiaries.length);
    const beneficiary = beneficiaries[beneficiaryIndex];
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const activityDate = formatDate(randomDate(new Date(2023, 0, 1), new Date()));
    activities.push({
      id: i + 1,
      beneficiaryId: beneficiary.id,
      name: beneficiary.name,
      activityType: activityType,
      date: activityDate,
      location: locations[Math.floor(Math.random() * locations.length)],
      source: sourceSystemMap[activityType]
    });
  }

  return activities;
};

// Function to add anomalies and trends to activities
const addAnomaliesAndTrends = (activities) => {
  // Simulate a surge in activities during summer months
  activities.forEach(activity => {
    const month = new Date(activity.date).getMonth();
    if (month >= 5 && month <= 7) { // June, July, August
      if (Math.random() < 0.3) { // 30% chance of additional activity
        const newActivity = { ...activity, id: activities.length + 1 };
        activities.push(newActivity);
      }
    }
  });

  // Simulate a temporary halt in some activities
  const haltStart = new Date('2023-03-15');
  const haltEnd = new Date('2023-04-15');
  activities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return !(activityDate >= haltStart && activityDate <= haltEnd && activity.activityType === 'Food Distribution');
  });

  return activities;
};

// Function to simulate project progress
const simulateProjectProgress = (projects, activities) => {
  Object.values(projects).flat().forEach(project => {
    const projectActivities = activities.filter(activity => 
      project.linkedActivities.includes(activity.activityType) &&
      new Date(activity.date) >= new Date('2023-01-01') &&
      new Date(activity.date) <= new Date('2023-12-31')
    );

    project.monthlyProgress = Array.from({ length: 12 }, (_, month) => {
      const monthActivities = projectActivities.filter(activity => 
        new Date(activity.date).getMonth() === month
      );
      return {
        month: new Date(2023, month, 1).toLocaleString('default', { month: 'short' }),
        count: monthActivities.length,
        uniqueBeneficiaries: new Set(monthActivities.map(a => a.beneficiaryId)).size
      };
    });
  });
};

// Function to generate mockup data
const generateMockupData = (numBeneficiaries = 1000, numActivities = 5000) => {
  const beneficiaryTypes = ['Refugee', 'IDP', 'Host Community', 'Returnee'];
  const nationalities = ['Ukrainian', 'Syrian', 'Afghan', 'Romanian', 'Moldovan'];
  const locations = ['Bucharest Branch', 'Cluj-Napoca Branch', 'Iasi Branch', 'Constanta Branch', 'Mobile Clinic'];
  const educationLevels = ['None', 'Primary', 'Secondary', 'Tertiary'];
  const occupations = ['Unemployed', 'Student', 'Agriculture', 'Trade', 'Professional', 'Retired'];
  const vulnerabilities = ['Disability', 'Chronic Illness', 'Single Parent', 'Elderly', 'None'];

  // Generate beneficiaries
  const beneficiaries = Array.from({ length: numBeneficiaries }, (_, i) => ({
    id: `B${String(i + 1).padStart(5, '0')}`,
    name: `Beneficiary ${i + 1}`,
    dateOfBirth: formatDate(randomDate(new Date(1950, 0, 1), new Date(2010, 0, 1))),
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    beneficiaryType: beneficiaryTypes[Math.floor(Math.random() * beneficiaryTypes.length)],
    temporaryProtectionNumber: `TP${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
    familyMembers: [],
    registrationDate: formatDate(randomDate(new Date(2022, 0, 1), new Date())),
    branch: locations[Math.floor(Math.random() * locations.length)],
    educationLevel: educationLevels[Math.floor(Math.random() * educationLevels.length)],
    occupation: occupations[Math.floor(Math.random() * occupations.length)],
    vulnerability: vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)],
    householdSize: Math.floor(Math.random() * 8) + 1,
    incomeLevel: Math.floor(Math.random() * 5000), // Monthly income in local currency
  }));

  // Create family relationships
  createFamilyRelationships(beneficiaries);

  // Generate activities
  let activities = generateActivities(beneficiaries, numActivities);

  // Add anomalies and trends
  activities = addAnomaliesAndTrends(activities);

  // Update beneficiaries with last activity
  beneficiaries.forEach(beneficiary => {
    const beneficiaryActivities = activities.filter(activity => activity.beneficiaryId === beneficiary.id);
    if (beneficiaryActivities.length > 0) {
      const lastActivity = beneficiaryActivities.reduce((latest, current) => 
        latest.date > current.date ? latest : current
      );
      beneficiary.lastActivity = {
        type: lastActivity.activityType,
        date: lastActivity.date,
        location: lastActivity.location,
      };
    }
  });

  // Generate projects
  const projects = {
    SEM: [
      {
        id: 'sem1',
        name: 'Employability Support',
        target: { value: 1000, description: 'People supported' },
        linkedActivities: ['Livelihood Support', 'Language Class'],
        locations: locations,
        beneficiaryTypes: beneficiaryTypes,
        nationalities: nationalities,
        calculationMethod: 'Count of unique beneficiaries receiving employability support'
      },
      {
        id: 'sem2',
        name: 'MHPSS Services',
        target: { value: 500, description: 'People receiving psychosocial support' },
        linkedActivities: ['MHPSS Session'],
        locations: locations,
        beneficiaryTypes: beneficiaryTypes,
        nationalities: nationalities,
        calculationMethod: 'Count of unique beneficiaries attending MHPSS sessions'
      }
    ],
    UkraineCrisis: [
      {
        id: 'ukr1',
        name: 'Emergency Food Assistance',
        target: { value: 5000, description: 'People receiving food assistance' },
        linkedActivities: ['Food Distribution'],
        locations: locations,
        beneficiaryTypes: beneficiaryTypes,
        nationalities: ['Ukrainian'],
        calculationMethod: 'Count of unique beneficiaries receiving food assistance'
      },
      {
        id: 'ukr2',
        name: 'Health Services',
        target: { value: 2000, description: 'Health consultations provided' },
        linkedActivities: ['Health Consultation'],
        locations: locations,
        beneficiaryTypes: beneficiaryTypes,
        nationalities: nationalities,
        calculationMethod: 'Sum of all health consultations provided'
      }
    ]
  };

  // Simulate project progress
  simulateProjectProgress(projects, activities);

  return { beneficiaries, activities, projects };
};

// Generate the mockup data
const { beneficiaries, activities, projects } = generateMockupData();

export { beneficiaries, activities, projects };

          


          