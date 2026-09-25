const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const exactRoles = [
  {
    role_name: 'Frontend Developer',
    required_skills: [
      'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue/Angular', 
      'Tailwind CSS', 'Responsive Design', 'Web Accessibility (a11y)', 
      'Webpack/Vite', 'REST APIs', 'Git', 'Jest/Testing', 'State Management'
    ]
  },
  {
    role_name: 'Backend Developer',
    required_skills: [
      'Node.js', 'Python/Java', 'Express.js/Django', 'PostgreSQL/MySQL', 
      'MongoDB/NoSQL', 'REST APIs', 'GraphQL', 'Docker', 'Microservices', 
      'Redis/Caching', 'Git', 'Authentication (JWT)', 'System Design'
    ]
  },
  {
    role_name: 'Full Stack Developer',
    required_skills: [
      'HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 
      'Express.js', 'PostgreSQL/MySQL', 'MongoDB', 'REST APIs', 
      'Git', 'Docker', 'AWS/GCP', 'CI/CD', 'Authentication'
    ]
  },
  {
    role_name: 'Data Scientist',
    required_skills: [
      'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 
      'Pandas', 'Scikit-Learn', 'TensorFlow/PyTorch', 'Data Visualization', 
      'Statistics', 'Jupyter', 'Big Data (Spark)', 'A/B Testing'
    ]
  },
  {
    role_name: 'Product Manager',
    required_skills: [
      'Agile Methodology', 'Scrum', 'Jira/Trello', 'Product Strategy', 
      'Roadmap Planning', 'A/B Testing', 'User Research', 'Wireframing', 
      'Data Analytics', 'Stakeholder Management', 'Go-to-Market Strategy', 
      'SQL', 'UX Principles'
    ]
  },
  {
    role_name: 'UI/UX Designer',
    required_skills: [
      'Figma', 'Adobe XD', 'Sketch', 'Wireframing', 'Prototyping', 
      'User Research', 'Usability Testing', 'Interaction Design', 
      'Visual Design', 'Information Architecture', 'Accessibility', 
      'HTML/CSS basics', 'Typography'
    ]
  },
  {
    role_name: 'DevOps Engineer',
    required_skills: [
      'Linux', 'Bash/Python Scripting', 'Docker', 'Kubernetes', 
      'CI/CD', 'Terraform (IaC)', 'AWS/Azure/GCP', 'Networking', 
      'Prometheus/Grafana', 'Ansible', 'Git', 'Web Servers (Nginx)'
    ]
  },
  {
    role_name: 'Mobile App Developer',
    required_skills: [
      'Swift/Kotlin', 'React Native', 'Flutter', 'Mobile UI/UX', 
      'REST APIs', 'SQLite/CoreData', 'Git', 'CI/CD for Mobile', 
      'App Store Deployment', 'Push Notifications', 'State Management', 
      'Offline Storage', 'Animations'
    ]
  },
  {
    role_name: 'Data Analyst',
    required_skills: [
      'SQL', 'Excel', 'Python/R', 'Tableau', 'Power BI', 
      'Data Cleaning', 'Data Visualization', 'Statistics', 
      'Pandas', 'Reporting', 'Dashboards', 'A/B Testing', 
      'Business Intelligence'
    ]
  },
  {
    role_name: 'Machine Learning Engineer',
    required_skills: [
      'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 
      'PyTorch', 'SQL', 'Docker', 'MLflow', 'Model Deployment', 
      'MLOps', 'AWS/GCP', 'Data Structures', 'Algorithms'
    ]
  },
  {
    role_name: 'Cybersecurity Analyst',
    required_skills: [
      'Network Security', 'Linux', 'Python/Bash', 'Penetration Testing', 
      'Firewalls', 'SIEM (Splunk)', 'Vulnerability Assessment', 
      'Incident Response', 'Cryptography', 'Ethical Hacking', 
      'Risk Management', 'Wireshark', 'OWASP'
    ]
  },
  {
    role_name: 'Cloud Architect',
    required_skills: [
      'AWS', 'Azure', 'GCP', 'System Design', 'Microservices', 
      'Serverless', 'Infrastructure as Code', 'Kubernetes', 
      'Cloud Security', 'Cost Optimization', 'Networking', 
      'CI/CD', 'Docker', 'High Availability'
    ]
  },
  {
    role_name: 'Quality Assurance Engineer',
    required_skills: [
      'Software Testing', 'Test Automation', 'Selenium/Cypress', 
      'JavaScript/Python', 'API Testing (Postman)', 'CI/CD Integration', 
      'Agile Methodology', 'Jira', 'Bug Tracking', 
      'Performance Testing (JMeter)', 'SQL', 'Git'
    ]
  },
  {
    role_name: 'Business Analyst',
    required_skills: [
      'Requirements Gathering', 'Agile/Scrum', 'Data Analysis', 
      'SQL', 'Excel', 'Process Modeling', 'Jira', 
      'Stakeholder Management', 'Tableau/Power BI', 'UAT', 
      'Business Strategy', 'Use Case Diagrams'
    ]
  },
  {
    role_name: 'Systems Administrator',
    required_skills: [
      'Linux/Unix', 'Windows Server', 'Active Directory', 
      'Networking (TCP/IP/DNS)', 'Bash/PowerShell', 'Virtualization (VMware)', 
      'Backup & Recovery', 'Cloud Administration', 'Hardware Troubleshooting', 
      'Security Basics', 'Firewalls', 'IT Support'
    ]
  }
];

async function updateRoles() {
  console.log("Updating role templates in Supabase...");
  
  for (const role of exactRoles) {
    const { error } = await supabase
      .from('role_skill_templates')
      .upsert({ 
        role_name: role.role_name, 
        required_skills: role.required_skills,
        recommended_projects: [], // Defaults to empty array if required by schema
      }, { onConflict: 'role_name' });
      
    if (error) {
      console.error(`Failed to update ${role.role_name}:`, error);
    } else {
      console.log(`✅ Updated ${role.role_name} (${role.required_skills.length} skills)`);
    }
  }
  
  console.log("Done!");
}

updateRoles();
