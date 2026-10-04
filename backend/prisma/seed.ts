import { PrismaClient, InfrastructureType, InfrastructureStatus, SeverityLevel, VerificationStatus, IssueType, ReportStatus, VerificationType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dead Infrastructure Mapper database seed...');

  // Clean existing tables
  await prisma.infrastructureStatusHistory.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.infrastructure.deleteMany();
  await prisma.area.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Seed Users
  console.log('Creating demo users...');
  await prisma.user.createMany({
    data: [
      { email: 'citizen@deadinfra.org', name: 'Aarav Sharma', role: UserRole.CITIZEN },
      { email: 'officer@deadinfra.org', name: 'Priya Deshmukh', role: UserRole.OFFICER },
      { email: 'admin@deadinfra.org', name: 'System Administrator', role: UserRole.ADMIN },
    ],
  });

  // 2. Create 5 Areas
  console.log('Creating geographic areas...');
  const areasData = [
    {
      name: 'College Road Urban Sector',
      description: 'High student footfall commercial and educational district',
      latitude: 19.9975,
      longitude: 73.7898,
      radius: 1500,
    },
    {
      name: 'Gangapur Road Boulevard',
      description: 'Residential and arterial avenue with major transit corridors',
      latitude: 20.0112,
      longitude: 73.7654,
      radius: 2000,
    },
    {
      name: 'Indiranagar Central Hub',
      description: 'Densely populated residential neighborhood and retail strip',
      latitude: 19.9823,
      longitude: 73.8012,
      radius: 1800,
    },
    {
      name: 'Old Town Heritage Quarter',
      description: 'Historic pedestrian alleys and market squares',
      latitude: 20.0051,
      longitude: 73.7915,
      radius: 1200,
    },
    {
      name: 'Tech & Industrial Park',
      description: 'Suburban IT parks and manufacturing zone',
      latitude: 19.9452,
      longitude: 73.7314,
      radius: 3000,
    },
  ];

  const createdAreas = [];
  for (const a of areasData) {
    const area = await prisma.area.create({ data: a });
    createdAreas.push(area);
  }

  // 3. Create 32 Infrastructure Assets
  console.log('Creating 32 infrastructure assets...');
  const infraSeedList: Array<{
    name: string;
    type: InfrastructureType;
    status: InfrastructureStatus;
    severity: SeverityLevel;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    reportCount: number;
    verificationStatus: VerificationStatus;
    areaIndex: number;
    imageUrl?: string;
  }> = [
    // Area 0: College Road (Degraded/Mixed)
    {
      name: 'Solar Streetlight Pole #CR-102',
      type: InfrastructureType.STREETLIGHT,
      status: InfrastructureStatus.BROKEN,
      severity: SeverityLevel.HIGH,
      description: 'Damaged solar panel and completely unlit fixture near girls hostel gate',
      latitude: 19.9981,
      longitude: 73.7905,
      address: 'Near RYK Science College Gate 2, College Road',
      reportCount: 3,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 0,
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600',
    },
    {
      name: 'Wheelchair Ramp at Campus Main Hall',
      type: InfrastructureType.WHEELCHAIR_RAMP,
      status: InfrastructureStatus.INACCESSIBLE,
      severity: SeverityLevel.CRITICAL,
      description: 'Ramp slope exceeds 25 degrees with missing side handrail and broken concrete surface',
      latitude: 19.9972,
      longitude: 73.7891,
      address: 'Commerce College Quadrangle, College Road',
      reportCount: 4,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 0,
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600',
    },
    {
      name: 'Public Drinking Water Station #04',
      type: InfrastructureType.DRINKING_WATER,
      status: InfrastructureStatus.BROKEN,
      severity: SeverityLevel.HIGH,
      description: 'Tap handles sheared off; continuous water leakage causing puddles',
      latitude: 19.9968,
      longitude: 73.7912,
      address: 'Opposite Dominoes Pizza, College Road',
      reportCount: 2,
      verificationStatus: VerificationStatus.COMMUNITY_VERIFIED,
      areaIndex: 0,
    },
    {
      name: 'Tactile Paver Sidewalk West',
      type: InfrastructureType.FOOTPATH,
      status: InfrastructureStatus.WARNING,
      severity: SeverityLevel.MEDIUM,
      description: 'Tactile guiding tiles missing for 40 meters, encroached by temporary hawker stalls',
      latitude: 19.9989,
      longitude: 73.7885,
      address: 'North pavement, College Road',
      reportCount: 1,
      verificationStatus: VerificationStatus.UNVERIFIED,
      areaIndex: 0,
    },
    {
      name: 'College Junction Traffic Signal #1',
      type: InfrastructureType.TRAFFIC_SIGNAL,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Fully operational synchronized automated signal',
      latitude: 19.9979,
      longitude: 73.7899,
      address: 'Krishi Nagar Intersection, College Road',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 0,
    },
    {
      name: 'Smart City Bus Shelter #CR-A',
      type: InfrastructureType.BUS_STOP,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Covered seating with solar lighting and LED schedule board',
      latitude: 19.9965,
      longitude: 73.7925,
      address: 'Near Bhosala Military Ground Stop',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 0,
    },

    // Area 1: Gangapur Road (High Reality Score / Good)
    {
      name: 'LED High-Mast Streetlight #GR-201',
      type: InfrastructureType.STREETLIGHT,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'High efficiency warm LED luminaire with automated timer',
      latitude: 20.0125,
      longitude: 73.7661,
      address: 'Jehan Circle, Gangapur Road',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 1,
    },
    {
      name: 'Accessible Bus Stop Terminal #GR-North',
      type: InfrastructureType.BUS_STOP,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Level boarding platform with tactile paving and wheelchair shelter space',
      latitude: 20.0108,
      longitude: 73.7645,
      address: 'Pipeline Road Cross, Gangapur Road',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 1,
    },
    {
      name: 'Greenway Pedestrian Boardwalk',
      type: InfrastructureType.FOOTPATH,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Wide continuous paved walkway with bollards protecting from motorized traffic',
      latitude: 20.0135,
      longitude: 73.7678,
      address: 'Navshya Ganapati Riverfront Walkway',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 1,
    },
    {
      name: 'Automated E-Toilet Kiosk #GT-01',
      type: InfrastructureType.PUBLIC_TOILET,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Self-cleaning pay-and-use coin toilet with automated sanitizer',
      latitude: 20.0098,
      longitude: 73.7632,
      address: 'Near Old Gangapur Naka Park',
      reportCount: 0,
      verificationStatus: VerificationStatus.COMMUNITY_VERIFIED,
      areaIndex: 1,
    },
    {
      name: 'Pedestrian Zebra Crossing Beacon',
      type: InfrastructureType.TRAFFIC_SIGNAL,
      status: InfrastructureStatus.WARNING,
      severity: SeverityLevel.MEDIUM,
      description: 'Amber flashing warning beacon flickers erratically after 8 PM',
      latitude: 20.0119,
      longitude: 73.7658,
      address: 'Serene Meadows Cross, Gangapur Road',
      reportCount: 1,
      verificationStatus: VerificationStatus.COMMUNITY_VERIFIED,
      areaIndex: 1,
    },
    {
      name: 'Chilled RO Drinking Water ATM #08',
      type: InfrastructureType.DRINKING_WATER,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Operational municipal filtration kiosk with clean dispensaries',
      latitude: 20.0142,
      longitude: 73.7685,
      address: 'Someshwar Temple Road Junction',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 1,
    },

    // Area 2: Indiranagar Central Hub (Moderate)
    {
      name: 'Streetlight Pole #IN-301',
      type: InfrastructureType.STREETLIGHT,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Operational 70W LED pole fixture',
      latitude: 19.9831,
      longitude: 73.8019,
      address: 'Rane Nagar Cross, Indiranagar',
      reportCount: 0,
      verificationStatus: VerificationStatus.COMMUNITY_VERIFIED,
      areaIndex: 2,
    },
    {
      name: 'Public Restroom Block #IN-12',
      type: InfrastructureType.PUBLIC_TOILET,
      status: InfrastructureStatus.BROKEN,
      severity: SeverityLevel.CRITICAL,
      description: 'Completely blocked sewer drain, no running water, locked doors for 3 weeks',
      latitude: 19.9815,
      longitude: 73.8005,
      address: 'Near Indiranagar Vegetable Market',
      reportCount: 5,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
    },
    {
      name: 'Commercial Sidewalk #IN-East',
      type: InfrastructureType.FOOTPATH,
      status: InfrastructureStatus.BROKEN,
      severity: SeverityLevel.HIGH,
      description: 'Collapsed drainage slab leaving 4-foot deep open ditch in footpath center',
      latitude: 19.9828,
      longitude: 73.8025,
      address: 'Opposite Jogging Track Gate, Indiranagar',
      reportCount: 3,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 2,
      imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600',
    },
    {
      name: 'Bus Stop Waiting Shed #IN-05',
      type: InfrastructureType.BUS_STOP,
      status: InfrastructureStatus.WARNING,
      severity: SeverityLevel.LOW,
      description: 'Corrugated roof sheet broken on eastern bay; rain penetrates',
      latitude: 19.9842,
      longitude: 73.7998,
      address: 'Lekha Nagar Stop, Indiranagar',
      reportCount: 1,
      verificationStatus: VerificationStatus.UNVERIFIED,
      areaIndex: 2,
    },
    {
      name: 'School Zone Traffic Calming Light',
      type: InfrastructureType.TRAFFIC_SIGNAL,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Dual amber flashing light operational during morning/evening school shifts',
      latitude: 19.9809,
      longitude: 73.8031,
      address: 'Near Podar International School, Indiranagar',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 2,
    },
    {
      name: 'Community Water Tap Post #IN-02',
      type: InfrastructureType.DRINKING_WATER,
      status: InfrastructureStatus.MISSING,
      severity: SeverityLevel.HIGH,
      description: 'Brass bibcock tap stolen; open pipe discharging into storm drain',
      latitude: 19.9818,
      longitude: 73.8015,
      address: 'Behind Community Hall, Indiranagar',
      reportCount: 2,
      verificationStatus: VerificationStatus.COMMUNITY_VERIFIED,
      areaIndex: 2,
    },

    // Area 3: Old Town Heritage Quarter (Severe / Critical)
    {
      name: 'Heritage Alley Cobblestone Footpath',
      type: InfrastructureType.FOOTPATH,
      status: InfrastructureStatus.BROKEN,
      severity: SeverityLevel.HIGH,
      description: 'Severe erosion and missing cobblestones causing multiple pedestrian falls',
      latitude: 20.0058,
      longitude: 73.7922,
      address: 'Main Bazaar Lane, Old Town',
      reportCount: 4,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 3,
    },
    {
      name: 'Heritage Fountain Drinking Water Point',
      type: InfrastructureType.DRINKING_WATER,
      status: InfrastructureStatus.BROKEN,
      severity: SeverityLevel.MEDIUM,
      description: 'Turbid contaminated water output; filtration chamber cracked',
      latitude: 20.0045,
      longitude: 73.7908,
      address: 'Saraf Bazaar Chowk, Old Town',
      reportCount: 3,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 3,
    },
    {
      name: 'Bustling Market Streetlight Row #OT-40',
      type: InfrastructureType.STREETLIGHT,
      status: InfrastructureStatus.BROKEN,
      severity: SeverityLevel.CRITICAL,
      description: 'Exposed live electrical wires hanging at 5 feet height after pole collision',
      latitude: 20.0062,
      longitude: 73.7931,
      address: 'Bhadrakali Temple Arch, Old Town',
      reportCount: 6,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 3,
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    },
    {
      name: 'Heritage Library Disabled Access Ramp',
      type: InfrastructureType.WHEELCHAIR_RAMP,
      status: InfrastructureStatus.MISSING,
      severity: SeverityLevel.HIGH,
      description: 'Original wooden accessibility ramp removed during painting and never replaced',
      latitude: 20.0039,
      longitude: 73.7899,
      address: 'Sarvajanik Vachanalaya, Old Town',
      reportCount: 2,
      verificationStatus: VerificationStatus.COMMUNITY_VERIFIED,
      areaIndex: 3,
    },
    {
      name: 'Municipal Public Lavatory #OT-01',
      type: InfrastructureType.PUBLIC_TOILET,
      status: InfrastructureStatus.INACCESSIBLE,
      severity: SeverityLevel.HIGH,
      description: 'Debris dumped by building renovation contractors blocking the entrance gate',
      latitude: 20.0069,
      longitude: 73.7918,
      address: 'Doodh Bazaar Corner, Old Town',
      reportCount: 2,
      verificationStatus: VerificationStatus.UNVERIFIED,
      areaIndex: 3,
    },
    {
      name: 'Heritage Bus Stand Canopy',
      type: InfrastructureType.BUS_STOP,
      status: InfrastructureStatus.WARNING,
      severity: SeverityLevel.MEDIUM,
      description: 'Rusty structural supports showing extensive oxidation; requires reinforcement',
      latitude: 20.0032,
      longitude: 73.7929,
      address: 'Old Central Bus Stand Bay 4',
      reportCount: 1,
      verificationStatus: VerificationStatus.COMMUNITY_VERIFIED,
      areaIndex: 3,
    },

    // Area 4: Tech & Industrial Park (Good / High Usability)
    {
      name: 'Industrial Corridor Streetlight Cluster #TP-10',
      type: InfrastructureType.STREETLIGHT,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Modern 150W high lumen smart lights with motion sensing dimmers',
      latitude: 19.9461,
      longitude: 73.7325,
      address: 'MIDC Main Spine Road, Tech Park',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 4,
    },
    {
      name: 'Tech Campus Multi-Modal Transit Hub',
      type: InfrastructureType.BUS_STOP,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Modern glass-enclosed shelter with e-ticketing and USB charging points',
      latitude: 19.9448,
      longitude: 73.7302,
      address: 'Symbiosis IT Gate Terminal',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 4,
    },
    {
      name: 'Accessible Curb Ramp Spine',
      type: InfrastructureType.WHEELCHAIR_RAMP,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'ADA compliant flush curb ramp with yellow tactile blister tiles',
      latitude: 19.9455,
      longitude: 73.7319,
      address: 'Software Technology Parks of India (STPI) Gate',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 4,
    },
    {
      name: 'Automated 4-Way Traffic Controller',
      type: InfrastructureType.TRAFFIC_SIGNAL,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Adaptive traffic camera integrated countdown signal',
      latitude: 19.9472,
      longitude: 73.7338,
      address: 'Ambad Flyover Underpass, Tech Park',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 4,
    },
    {
      name: 'Corporate Zone Paved Sidewalk',
      type: InfrastructureType.FOOTPATH,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Interlocking concrete paver walkway with tree grates and waste bins',
      latitude: 19.9439,
      longitude: 73.7291,
      address: 'Aviation IT Corridor East',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 4,
    },
    {
      name: 'Eco Restroom Pod #TP-Green',
      type: InfrastructureType.PUBLIC_TOILET,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Solar powered bio-toilet with automated touchless water dispensers',
      latitude: 19.9468,
      longitude: 73.7308,
      address: 'Tech Park Central Recreation Garden',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 4,
    },
    {
      name: 'Purified Water Refill Dispenser #TP-02',
      type: InfrastructureType.DRINKING_WATER,
      status: InfrastructureStatus.WARNING,
      severity: SeverityLevel.LOW,
      description: 'Chilled water dispenser filter replacement overdue light active',
      latitude: 19.9442,
      longitude: 73.7331,
      address: 'Incubation Center Entry Plaza',
      reportCount: 1,
      verificationStatus: VerificationStatus.COMMUNITY_VERIFIED,
      areaIndex: 4,
    },
    {
      name: 'Pedestrian Crossing Light #TP-Cross',
      type: InfrastructureType.TRAFFIC_SIGNAL,
      status: InfrastructureStatus.WORKING,
      severity: SeverityLevel.LOW,
      description: 'Push-button audio pedestrian crossing chime for visually impaired',
      latitude: 19.9458,
      longitude: 73.7345,
      address: 'Engineering R&D Complex Gate',
      reportCount: 0,
      verificationStatus: VerificationStatus.OFFICIALLY_VERIFIED,
      areaIndex: 4,
    },
  ];

  const createdInfrastructures = [];
  for (const item of infraSeedList) {
    const area = createdAreas[item.areaIndex];
    const created = await prisma.infrastructure.create({
      data: {
        name: item.name,
        type: item.type,
        status: item.status,
        severity: item.severity,
        description: item.description,
        latitude: item.latitude,
        longitude: item.longitude,
        address: item.address,
        reportCount: item.reportCount,
        verificationStatus: item.verificationStatus,
        areaId: area.id,
        imageUrl: item.imageUrl,
        lastVerifiedAt: item.verificationStatus !== VerificationStatus.UNVERIFIED ? new Date() : null,
      },
    });
    createdInfrastructures.push(created);

    // If status is not WORKING, insert an initial audit history entry
    if (item.status !== InfrastructureStatus.WORKING) {
      await prisma.infrastructureStatusHistory.create({
        data: {
          infrastructureId: created.id,
          oldStatus: InfrastructureStatus.WORKING,
          newStatus: item.status,
          reason: `Initial asset defect survey: ${item.description.slice(0, 100)}`,
        },
      });
    }
  }

  // 4. Create 30 Citizen Reports & Verifications
  console.log('Creating 30 citizen reports and verifications...');
  const reportSeedList: Array<{
    infraIndex: number;
    issueType: IssueType;
    severity: SeverityLevel;
    description: string;
    status: ReportStatus;
    reporterName: string;
    verifiedBy?: string;
    verifType?: VerificationType;
  }> = [
    {
      infraIndex: 0,
      issueType: IssueType.NOT_WORKING,
      severity: SeverityLevel.HIGH,
      description: 'Solar streetlight has been dark since heavy rainfall last week.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Neha Kulkarni',
      verifiedBy: 'Inspector R. Patil',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 0,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.HIGH,
      description: 'The solar panel bracket came loose and is dangling dangerously.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Rahul Verma',
      verifiedBy: 'College Security Team',
      verifType: VerificationType.COMMUNITY,
    },
    {
      infraIndex: 0,
      issueType: IssueType.UNSAFE,
      severity: SeverityLevel.HIGH,
      description: 'Dark stretch at night makes female students feel unsafe.',
      status: ReportStatus.UNDER_REVIEW,
      reporterName: 'Pooja Shinde',
    },
    {
      infraIndex: 1,
      issueType: IssueType.INACCESSIBLE,
      severity: SeverityLevel.CRITICAL,
      description: 'Ramp slope is ridiculously steep; wheelchair user almost flipped backward.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Sanjay More (Disability Rights Activist)',
      verifiedBy: 'Municipal Accessibility Auditor',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 1,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.CRITICAL,
      description: 'Missing handrail and crumbled cement at the bottom edge.',
      status: ReportStatus.SUBMITTED,
      reporterName: 'Kunal Joshi',
    },
    {
      infraIndex: 2,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.HIGH,
      description: 'Water tap handle is missing and potable water is gushing onto the sidewalk.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Vikas Jadhav',
      verifiedBy: 'Local Merchant Association',
      verifType: VerificationType.COMMUNITY,
    },
    {
      infraIndex: 2,
      issueType: IssueType.BLOCKED,
      severity: SeverityLevel.MEDIUM,
      description: 'Drain beneath the water dispenser is clogged with disposable cups.',
      status: ReportStatus.RESOLVED,
      reporterName: 'Aniket Rathi',
    },
    {
      infraIndex: 3,
      issueType: IssueType.BLOCKED,
      severity: SeverityLevel.MEDIUM,
      description: 'Hawker carts have chained themselves onto the tactile pathway.',
      status: ReportStatus.SUBMITTED,
      reporterName: 'Sunil Rao',
    },
    {
      infraIndex: 10,
      issueType: IssueType.NOT_WORKING,
      severity: SeverityLevel.MEDIUM,
      description: 'Pedestrian warning beacon is blinking erratically.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Dr. Meera Iyer',
      verifiedBy: 'Traffic Warden Deshmukh',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 13,
      issueType: IssueType.BLOCKED,
      severity: SeverityLevel.CRITICAL,
      description: 'Severely clogged toilet overflowing with foul sewage.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Ganesh Shirsat',
      verifiedBy: 'Ward Sanitation Officer',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 13,
      issueType: IssueType.NOT_WORKING,
      severity: SeverityLevel.HIGH,
      description: 'No running water in any cubicle.',
      status: ReportStatus.UNDER_REVIEW,
      reporterName: 'Kavita D.',
    },
    {
      infraIndex: 14,
      issueType: IssueType.UNSAFE,
      severity: SeverityLevel.CRITICAL,
      description: 'Open drainage hole in middle of footpath without barricade or warning sign.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Tanvi Gokhale',
      verifiedBy: 'Indiranagar Resident Welfare Assoc.',
      verifType: VerificationType.COMMUNITY,
    },
    {
      infraIndex: 14,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.HIGH,
      description: 'Concrete cover collapsed after truck drove onto pavement.',
      status: ReportStatus.UNDER_REVIEW,
      reporterName: 'Amit Trivedi',
    },
    {
      infraIndex: 15,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.LOW,
      description: 'Bus stop sheet broken causing rain leak.',
      status: ReportStatus.SUBMITTED,
      reporterName: 'Deepak Nalawade',
    },
    {
      infraIndex: 17,
      issueType: IssueType.MISSING,
      severity: SeverityLevel.HIGH,
      description: 'Public tap post stolen overnight.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Sarita Bhagat',
      verifiedBy: 'Ward Councillor Office',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 18,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.HIGH,
      description: 'Cobblestones dislodged across main market alleyway.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Manoj Bora',
      verifiedBy: 'Heritage Trust Observer',
      verifType: VerificationType.COMMUNITY,
    },
    {
      infraIndex: 18,
      issueType: IssueType.UNSAFE,
      severity: SeverityLevel.HIGH,
      description: 'Elderly person tripped on loose pavers and suffered ankle sprain.',
      status: ReportStatus.UNDER_REVIEW,
      reporterName: 'Ramesh Patel',
    },
    {
      infraIndex: 19,
      issueType: IssueType.NOT_WORKING,
      severity: SeverityLevel.MEDIUM,
      description: 'Potable water tap emitting cloudy brown water.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Hemant Kasar',
      verifiedBy: 'Water Quality Inspector',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 20,
      issueType: IssueType.UNSAFE,
      severity: SeverityLevel.CRITICAL,
      description: 'Live exposed 220V wires hanging over sidewalk near Bhadrakali temple.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Shraddha Wagh',
      verifiedBy: 'State Electricity Engineer',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 20,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.CRITICAL,
      description: 'Pole base bent at 45 degree angle after delivery vehicle hit it.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Omkar B.',
      verifiedBy: 'Traffic Police Patrol',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 21,
      issueType: IssueType.MISSING,
      severity: SeverityLevel.HIGH,
      description: 'Disabled ramp was dismantled during renovation and never restored.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Advocate Shailesh Roy',
      verifiedBy: 'District Collector Accessibility Cell',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 22,
      issueType: IssueType.BLOCKED,
      severity: SeverityLevel.HIGH,
      description: 'Piles of construction rubble preventing access to public toilet.',
      status: ReportStatus.SUBMITTED,
      reporterName: 'Bhushan Ahire',
    },
    {
      infraIndex: 23,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.MEDIUM,
      description: 'Rust eating through bus stop pillar support.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Vijay Sonawane',
      verifiedBy: 'City Bus Transport Depot',
      verifType: VerificationType.OFFICIAL,
    },
    {
      infraIndex: 30,
      issueType: IssueType.NOT_WORKING,
      severity: SeverityLevel.LOW,
      description: 'Water dispenser indicator blinking red for filter service.',
      status: ReportStatus.RESOLVED,
      reporterName: 'Pravin Gaikwad',
    },
    {
      infraIndex: 4,
      issueType: IssueType.NOT_WORKING,
      severity: SeverityLevel.LOW,
      description: 'Minor timer sync lag on red signal countdown (2 seconds delay).',
      status: ReportStatus.RESOLVED,
      reporterName: 'Nitin K.',
    },
    {
      infraIndex: 7,
      issueType: IssueType.BLOCKED,
      severity: SeverityLevel.LOW,
      description: 'Tree branch brushing against bus stop glass shelter.',
      status: ReportStatus.RESOLVED,
      reporterName: 'Sheetal Gore',
    },
    {
      infraIndex: 8,
      issueType: IssueType.BROKEN,
      severity: SeverityLevel.LOW,
      description: 'Minor chip on boardwalk kerb stone.',
      status: ReportStatus.RESOLVED,
      reporterName: 'Aditya Kale',
    },
    {
      infraIndex: 26,
      issueType: IssueType.BLOCKED,
      severity: SeverityLevel.LOW,
      description: 'Scooter parked on curb ramp rampway for 1 hour.',
      status: ReportStatus.RESOLVED,
      reporterName: 'Kishore M.',
    },
    {
      infraIndex: 27,
      issueType: IssueType.NOT_WORKING,
      severity: SeverityLevel.LOW,
      description: 'Pedestrian countdown light bulb flickered momentarily.',
      status: ReportStatus.RESOLVED,
      reporterName: 'Rohit Thorat',
    },
    {
      infraIndex: 1,
      issueType: IssueType.UNSAFE,
      severity: SeverityLevel.CRITICAL,
      description: 'Elderly visitor with walker slid on steep slick ramp.',
      status: ReportStatus.VERIFIED,
      reporterName: 'Dr. Ashwin B.',
      verifiedBy: 'Civil Hospital Surgeon',
      verifType: VerificationType.COMMUNITY,
    },
  ];

  for (const r of reportSeedList) {
    const infra = createdInfrastructures[r.infraIndex];
    const report = await prisma.report.create({
      data: {
        infrastructureId: infra.id,
        areaId: infra.areaId,
        issueType: r.issueType,
        severity: r.severity,
        description: r.description,
        latitude: infra.latitude + (Math.random() - 0.5) * 0.0004,
        longitude: infra.longitude + (Math.random() - 0.5) * 0.0004,
        status: r.status,
        reporterName: r.reporterName,
      },
    });

    if (r.verifiedBy && r.verifType) {
      await prisma.verification.create({
        data: {
          reportId: report.id,
          verificationType: r.verifType,
          verifiedBy: r.verifiedBy,
          notes: 'Inspected on-site during ground validation sprint.',
        },
      });
    }
  }

  console.log('✅ Database seeding complete! Successfully populated:');
  console.log(`- 3 Users`);
  console.log(`- ${createdAreas.length} Areas`);
  console.log(`- ${createdInfrastructures.length} Infrastructure items`);
  console.log(`- ${reportSeedList.length} Citizen Reports and Verifications`);
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
