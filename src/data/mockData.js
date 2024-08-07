// Utility functions
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Locations
const locations = [
  { id: 1, name: 'Bucharest Branch', latitude: 44.4268, longitude: 26.1025 },
  { id: 2, name: 'Cluj-Napoca Branch', latitude: 46.7712, longitude: 23.6236 },
  { id: 3, name: 'Iasi Branch', latitude: 47.1585, longitude: 27.6014 },
  { id: 4, name: 'Timisoara Branch', latitude: 45.7489, longitude: 21.2087 },
  { id: 5, name: 'Constanta Branch', latitude: 44.1598, longitude: 28.6348 },
  { id: 6, name: 'Mobile Clinic', latitude: 45.9432, longitude: 24.9668 },
];

// Beneficiary Types
const beneficiaryTypes = ['Refugee', 'IDP', 'Host Community', 'Returnee'];

// Nationalities
const nationalities = ['Ukrainian', 'Syrian', 'Afghan', 'Romanian', 'Moldovan'];

// Activity Types
const activityTypes = [
  'Food Distribution',
  'Health Consultation',
  'Language Class',
  'Cash Assistance',
  'MHPSS Session',
  'Livelihood Support'
];

// Generate Beneficiaries
const generateBeneficiaries = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `B${String(i + 1).padStart(5, '0')}`,
    name: `Beneficiary ${i + 1}`,
    dateOfBirth: formatDate(randomDate(new Date(1950, 0, 1), new Date(2010, 0, 1))),
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
    beneficiaryType: beneficiaryTypes[Math.floor(Math.random() * beneficiaryTypes.length)],
    registrationDate: formatDate(randomDate(new Date(2022, 0, 1), new Date())),
    location: locations[Math.floor(Math.random() * locations.length)].name,
  }));
};

// Generate Activities
const generateActivities = (beneficiaries, count) => {
  return Array.from({ length: count }, (_, i) => {
    const beneficiary = beneficiaries[Math.floor(Math.random() * beneficiaries.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    return {
      id: `A${String(i + 1).padStart(5, '0')}`,
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.name,
      activityType: activityType,
      date: formatDate(randomDate(new Date(2023, 0, 1), new Date())),
      location: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
    };
  });
};

// Generate Projects
const generateProjects = () => {
  return {
    'Emergency Response': [
      {
        id: 'ER1',
        name: 'Food Security',
        target: { value: 5000, description: 'Individuals receiving food assistance' },
        linkedActivities: ['Food Distribution'],
        locations: locations.map(l => l.name),
        beneficiaryTypes: beneficiaryTypes,
        nationalities: nationalities,
        calculationMethod: 'Count of unique beneficiaries receiving food distribution'
      },
      {
        id: 'ER2',
        name: 'Health Support',
        target: { value: 2000, description: 'Health consultations provided' },
        linkedActivities: ['Health Consultation'],
        locations: locations.map(l => l.name),
        beneficiaryTypes: beneficiaryTypes,
        nationalities: nationalities,
        calculationMethod: 'Count of health consultations provided'
      }
    ],
    'Integration Program': [
      {
        id: 'IP1',
        name: 'Language Training',
        target: { value: 1000, description: 'Individuals completing language courses' },
        linkedActivities: ['Language Class'],
        locations: locations.map(l => l.name),
        beneficiaryTypes: beneficiaryTypes,
        nationalities: nationalities,
        calculationMethod: 'Count of unique beneficiaries completing language courses'
      },
      {
        id: 'IP2',
        name: 'Livelihood Support',
        target: { value: 500, description: 'Individuals receiving livelihood assistance' },
        linkedActivities: ['Livelihood Support'],
        locations: locations.map(l => l.name),
        beneficiaryTypes: beneficiaryTypes,
        nationalities: nationalities,
        calculationMethod: 'Count of unique beneficiaries receiving livelihood support'
      }
    ]
  };
};

// Generate the mockup data
const beneficiaries = generateBeneficiaries(1000);
const activities = generateActivities(beneficiaries, 5000);
const projects = generateProjects();

export { beneficiaries, activities, projects, locations, activityTypes };