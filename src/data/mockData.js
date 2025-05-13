// Mock data for development purposes

// Analytics stats
export const analyticsStats = [
  { 
    id: 1, 
    title: 'Total Applications', 
    value: '2,856', 
    change: 12.5, 
    changeType: 'increase' 
  },
  { 
    id: 2, 
    title: 'Active Jobs', 
    value: '246', 
    change: 3.2, 
    changeType: 'increase' 
  },
  { 
    id: 3, 
    title: 'New Candidates', 
    value: '512', 
    change: 8.1, 
    changeType: 'decrease' 
  },
  { 
    id: 4, 
    title: 'Time to Hire', 
    value: '18 days', 
    change: 5.3, 
    changeType: 'decrease' 
  }
];

// Chart data
export const applicationsChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  values: [65, 78, 90, 105, 112, 125, 130, 140, 160, 175, 190, 210]
};

export const hiringMetricsData = {
  labels: ['Applications', 'Screenings', 'Interviews', 'Offers', 'Hires'],
  values: [100, 80, 60, 40, 20]
};

// Top performers
export const topPerformers = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    title: 'Senior Recruiter', 
    initials: 'SJ', 
    value: 42 
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    title: 'HR Manager', 
    initials: 'MC', 
    value: 38 
  },
  { 
    id: 3, 
    name: 'Emily Rodriguez', 
    title: 'Technical Recruiter', 
    initials: 'ER', 
    value: 35 
  },
  { 
    id: 4, 
    name: 'David Kim', 
    title: 'Talent Acquisition', 
    initials: 'DK', 
    value: 31 
  }
];

// Job categories
export const jobCategories = [
  'Software Development',
  'Marketing',
  'Sales',
  'Design',
  'Customer Support',
  'Finance',
  'Human Resources',
  'Product Management',
  'Data Science',
  'DevOps'
];

// Job locations
export const jobLocations = [
  'New York, NY',
  'San Francisco, CA',
  'Austin, TX',
  'Chicago, IL',
  'Boston, MA',
  'Seattle, WA',
  'Los Angeles, CA',
  'Denver, CO',
  'Atlanta, GA',
  'Remote'
];

// Employment types
export const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Internship'
];

// Skill levels
export const skillLevels = [
  'Entry',
  'Junior',
  'Mid-level',
  'Senior',
  'Lead',
  'Manager'
];

// CV data
export const mockCVData = [
  {
    id: 'cv-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    createdAt: '2023-05-15',
    updatedAt: '2023-07-21',
    summary: 'Experienced software developer with over 8 years of experience in full-stack development, specializing in React, Node.js, and cloud infrastructure.',
    skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'TypeScript', 'MongoDB'],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Innovators Inc.',
        period: 'Jan 2020 - Present',
        description: 'Leading development of enterprise SaaS products and mentoring junior developers.'
      },
      {
        title: 'Software Developer',
        company: 'Digital Solutions LLC',
        period: 'Mar 2017 - Dec 2019',
        description: 'Developed and maintained web applications using React and Node.js.'
      }
    ],
    education: [
      {
        degree: 'Master of Computer Science',
        institution: 'University of Technology',
        period: '2015 - 2017'
      },
      {
        degree: 'Bachelor of Science in Computer Engineering',
        institution: 'State University',
        period: '2011 - 2015'
      }
    ],
    downloadUrl: '#',
    skillLevel: 'senior'
  },
  {
    id: 'cv-002',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '+1 (555) 987-6543',
    status: 'pending',
    createdAt: '2023-06-10',
    updatedAt: '2023-06-10',
    summary: 'UI/UX designer with a passion for creating intuitive and engaging user experiences. Skilled in user research, wireframing, and prototyping.',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research', 'Prototyping', 'HTML/CSS'],
    experience: [
      {
        title: 'UI/UX Designer',
        company: 'Creative Design Studio',
        period: 'Aug 2019 - Present',
        description: 'Design user interfaces for web and mobile applications, conduct user research, and create wireframes and prototypes.'
      },
      {
        title: 'Graphic Designer',
        company: 'Print Media Solutions',
        period: 'May 2017 - Jul 2019',
        description: 'Created visual concepts for various print and digital media projects.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Fine Arts in Graphic Design',
        institution: 'Art Institute',
        period: '2013 - 2017'
      }
    ],
    downloadUrl: '#',
    skillLevel: 'mid'
  },
  {
    id: 'cv-003',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 456-7890',
    status: 'rejected',
    createdAt: '2023-04-05',
    updatedAt: '2023-05-20',
    summary: 'Data scientist with expertise in machine learning, statistical analysis, and big data technologies. Experienced in developing predictive models and data-driven solutions.',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Visualization', 'Statistical Analysis'],
    experience: [
      {
        title: 'Data Scientist',
        company: 'Analytics Experts Inc.',
        period: 'Nov 2020 - Present',
        description: 'Develop machine learning models and perform data analysis to solve complex business problems.'
      },
      {
        title: 'Data Analyst',
        company: 'Business Intelligence Co.',
        period: 'Jun 2018 - Oct 2020',
        description: 'Analyzed business data and created reports and dashboards for stakeholders.'
      }
    ],
    education: [
      {
        degree: 'Master of Science in Data Science',
        institution: 'Tech University',
        period: '2016 - 2018'
      },
      {
        degree: 'Bachelor of Science in Statistics',
        institution: 'State College',
        period: '2012 - 2016'
      }
    ],
    downloadUrl: '#',
    skillLevel: 'senior'
  },
  {
    id: 'cv-004',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '+1 (555) 321-6549',
    status: 'active',
    createdAt: '2023-07-12',
    updatedAt: '2023-07-15',
    summary: 'Marketing professional with expertise in digital marketing strategies, content creation, and social media management. Proven track record of increasing brand awareness and engagement.',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media', 'Google Analytics', 'Email Marketing'],
    experience: [
      {
        title: 'Marketing Manager',
        company: 'Global Brands Ltd.',
        period: 'Feb 2021 - Present',
        description: 'Develop and implement comprehensive marketing strategies to drive brand growth and customer engagement.'
      },
      {
        title: 'Digital Marketing Specialist',
        company: 'Online Marketing Agency',
        period: 'Sep 2018 - Jan 2021',
        description: 'Executed digital marketing campaigns across various channels and analyzed performance metrics.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Business Administration in Marketing',
        institution: 'Business School',
        period: '2014 - 2018'
      }
    ],
    downloadUrl: '#',
    skillLevel: 'mid'
  },
  {
    id: 'cv-005',
    name: 'David Rodriguez',
    email: 'david.rodriguez@example.com',
    phone: '+1 (555) 789-0123',
    status: 'pending',
    createdAt: '2023-07-01',
    updatedAt: '2023-07-05',
    summary: 'DevOps engineer focused on building and maintaining robust CI/CD pipelines, containerization, and cloud infrastructure. Experienced in automating deployment processes and improving system reliability.',
    skills: ['DevOps', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux'],
    experience: [
      {
        title: 'DevOps Engineer',
        company: 'Cloud Solutions Inc.',
        period: 'Apr 2019 - Present',
        description: 'Manage cloud infrastructure and implement CI/CD pipelines for application deployment.'
      },
      {
        title: 'Systems Administrator',
        company: 'IT Services Co.',
        period: 'Jan 2017 - Mar 2019',
        description: 'Maintained server infrastructure and network systems for enterprise clients.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Technical University',
        period: '2013 - 2017'
      }
    ],
    downloadUrl: '#',
    skillLevel: 'senior'
  }
];

// Job data
export const mockJobsData = [
  {
    id: 'job-001',
    title: 'Senior Software Engineer',
    company: 'Tech Innovators Inc.',
    location: 'San Francisco, CA',
    status: 'active',
    employmentType: 'Full-time',
    experienceLevel: 'Senior',
    postedDate: '2023-06-15',
    createdAt: '2023-06-15',
    updatedAt: '2023-06-15',
    applicationCount: 37,
    description: 'We are looking for a Senior Software Engineer to join our growing team. The ideal candidate will have strong experience with modern web technologies and a passion for writing clean, maintainable code.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '5+ years of experience in software development',
      'Proficiency in JavaScript, React, and Node.js',
      'Experience with cloud technologies (AWS, Azure, or GCP)',
      'Strong problem-solving skills and attention to detail'
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'AWS', 'TypeScript', 'RESTful APIs'],
    salary: '$120,000 - $150,000',
    benefits: [
      'Competitive salary and equity package',
      'Health, dental, and vision insurance',
      'Flexible work schedule and remote options',
      '401(k) with company match',
      'Professional development budget'
    ]
  },
  {
    id: 'job-002',
    title: 'UX/UI Designer',
    company: 'Creative Solutions Co.',
    location: 'New York, NY',
    status: 'active',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Level',
    postedDate: '2023-07-01',
    createdAt: '2023-07-01',
    updatedAt: '2023-07-05',
    applicationCount: 24,
    description: 'We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have a strong portfolio demonstrating their design skills and ability to solve complex user problems.',
    requirements: [
      'Bachelor\'s degree in Design, HCI, or related field',
      '3+ years of experience in UX/UI design',
      'Proficiency in design tools like Figma and Adobe Creative Suite',
      'Experience with user research and usability testing',
      'Strong portfolio showcasing previous work'
    ],
    skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping', 'Wireframing'],
    salary: '$90,000 - $110,000',
    benefits: [
      'Competitive salary',
      'Health benefits',
      'Flexible work hours',
      'Remote work options',
      'Creative environment'
    ]
  },
  {
    id: 'job-003',
    title: 'Data Scientist',
    company: 'Data Analytics Inc.',
    location: 'Remote',
    status: 'active',
    employmentType: 'Full-time',
    experienceLevel: 'Senior',
    postedDate: '2023-06-25',
    createdAt: '2023-06-25',
    updatedAt: '2023-06-30',
    applicationCount: 42,
    description: 'We are looking for a Data Scientist to join our team to help analyze complex data sets and derive actionable insights for our clients. The ideal candidate will have a strong background in statistics and machine learning.',
    requirements: [
      'Master\'s or PhD in Statistics, Computer Science, or related field',
      '4+ years of experience in data science or related field',
      'Strong programming skills in Python and R',
      'Experience with machine learning frameworks',
      'Excellent communication skills'
    ],
    skills: ['Python', 'R', 'Machine Learning', 'SQL', 'Data Visualization', 'Statistical Analysis'],
    salary: '$130,000 - $160,000',
    benefits: [
      'Competitive salary',
      'Comprehensive benefits package',
      'Remote work',
      'Professional development opportunities',
      'Collaborative team environment'
    ]
  },
  {
    id: 'job-004',
    title: 'Marketing Manager',
    company: 'Global Brands Ltd.',
    location: 'Chicago, IL',
    status: 'paused',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-Level',
    postedDate: '2023-05-20',
    createdAt: '2023-05-20',
    updatedAt: '2023-06-15',
    applicationCount: 18,
    description: 'We are seeking a Marketing Manager to lead our marketing efforts and develop strategies to increase brand awareness and drive customer engagement.',
    requirements: [
      'Bachelor\'s degree in Marketing, Business, or related field',
      '3-5 years of experience in marketing roles',
      'Experience with digital marketing channels',
      'Strong analytical and project management skills',
      'Excellent written and verbal communication skills'
    ],
    skills: ['Digital Marketing', 'SEO', 'Content Marketing', 'Social Media', 'Marketing Analytics', 'Campaign Management'],
    salary: '$85,000 - $105,000',
    benefits: [
      'Competitive salary',
      'Health and dental insurance',
      'Paid time off',
      '401(k) plan',
      'Professional development opportunities'
    ]
  },
  {
    id: 'job-005',
    title: 'DevOps Engineer',
    company: 'Cloud Infrastructure Co.',
    location: 'Austin, TX',
    status: 'active',
    employmentType: 'Full-time',
    experienceLevel: 'Senior',
    postedDate: '2023-07-10',
    createdAt: '2023-07-10',
    updatedAt: '2023-07-12',
    applicationCount: 15,
    description: 'We are looking for a DevOps Engineer to help build and maintain our cloud infrastructure. The ideal candidate will have experience with containerization, CI/CD pipelines, and cloud platforms.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '4+ years of experience in DevOps or similar role',
      'Experience with AWS, Azure, or GCP',
      'Knowledge of containerization technologies like Docker and Kubernetes',
      'Experience with CI/CD tools and practices'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'CI/CD'],
    salary: '$115,000 - $145,000',
    benefits: [
      'Competitive salary',
      'Health, dental, and vision insurance',
      'Flexible work arrangements',
      '401(k) with employer match',
      'Continuous learning opportunities'
    ]
  }
];

// Analytics mock data
export const mockAnalyticsData = {
  overviewStats: [
    {
      id: 'total_jobs',
      title: 'Total Jobs',
      value: 567,
      change: 12.5,
      direction: 'up',
      period: 'from last month'
    },
    {
      id: 'active_jobs',
      title: 'Active Jobs',
      value: 312,
      change: 7.8,
      direction: 'up',
      period: 'from last month'
    },
    {
      id: 'total_applications',
      title: 'Applications',
      value: 3842,
      change: 3.2,
      direction: 'down',
      period: 'from last month'
    },
    {
      id: 'conversion_rate',
      title: 'Conversion Rate',
      value: '18.3%',
      change: 1.1,
      direction: 'up',
      period: 'from last month'
    }
  ],
  
  jobsByCategory: {
    labels: ['IT & Software', 'Marketing', 'Design', 'Sales', 'Customer Support', 'Finance', 'HR'],
    data: [42, 28, 16, 22, 14, 11, 9]
  },
  
  applicationTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        name: 'Applications',
        data: [380, 420, 510, 470, 540, 580, 620, 590, 640, 720, 680, 580]
      }
    ]
  },
  
  conversionFunnel: {
    stages: ['Applications', 'Screening', 'Interview', 'Offer', 'Hired'],
    values: [1000, 560, 320, 140, 60]
  },
  
  topReferrers: [
    { source: 'LinkedIn', count: 842, percentage: 24 },
    { source: 'Indeed', count: 721, percentage: 21 },
    { source: 'Direct Website', count: 568, percentage: 16 },
    { source: 'Glassdoor', count: 425, percentage: 12 },
    { source: 'Google', count: 312, percentage: 9 }
  ],
  
  activeCandidates: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        name: 'New Candidates',
        data: [120, 132, 95, 142]
      },
      {
        name: 'Returning Candidates',
        data: [65, 72, 51, 89]
      }
    ]
  },
  
  geographicDistribution: {
    regions: ['North America', 'Europe', 'Asia', 'Australia', 'South America', 'Africa'],
    values: [42, 28, 16, 8, 4, 2]
  }
};

// Export mock data for other pages as needed
export default {
  analyticsStats,
  applicationsChartData,
  hiringMetricsData,
  topPerformers,
  jobCategories,
  jobLocations,
  employmentTypes,
  skillLevels,
  mockCVData,
  mockJobsData,
  mockAnalyticsData
};
