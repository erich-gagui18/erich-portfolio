const { createApp } = Vue;

createApp({
  data(){
    return {
      menuOpen:false,
      booting:true,
      bootDone:false,
      bootLines:[
        'INITIALIZING KERNEL...',
        'MOUNTING /dev/erich...',
        "CONNECTING TO DATABASE 'erich_dev'...",
        'LOADING SCHEMA: projects, stack, migrations...',
        'COMPILING RECORDS... 9 ENTRIES FOUND',
        'RENDERING INTERFACE...',
        'SYSTEM READY'
      ],
      visibleBootLines:[],
      bootProgress:0,
      lightbox:{ open:false, images:[], index:0 },
      projects:[
        {
          name:'complaint_management_system',
          title:'Online Complaint Management System with AI Assistant',
          status:'In Progress',
          desc:'Primary capstone project for the university SAEP Office. Lets students and staff file, track, and resolve complaints, supported by an AI assistant that helps route and respond to submissions.',
          stack:['Backend logic','AI assistant integration','Relational database'],
          role:'Backend Developer',
          notes:'Resource Matrix and Chapters 1 to 3 completed, Ready for Proposal.',
          team: 'John Mark Florence C. Tercero — UI/UX & QA · Lauren Sidney M. Lina — Documentation'
        },
        {
          name:'lokalkusinero',
          title:'LokalKusinero',
          status:'Active',
          logo:'assets/logos/lokalkusinero-logo.png',
          link:'https://kusineronglokal.site.je/lokalkusinero/public_html/home.php',
          desc:'A Filipino recipe and pantry management web app built on a PHP MVC architecture, designed around a nine-table schema spanning five feature tabs with a canonical 30-recipe seed set.',
          stack:['PHP (MVC)','Vanilla JavaScript','MySQL / MyISAM'],
          role:'Backend Developer',
          notes:'MyISAM with no FK enforcement by design — integrity is handled in application logic instead, which keeps seed re-runs fast during active development. Seed files delete across the full prior-data range to prevent duplicate-entry errors. Shipped as versioned zips with a running CHANGELOG.md.'
        },
        {
          name:'lominous_safety_companion',
          title:'Lominous — Safety Companion Web App',
          status:'Active',
          logo:'assets/logos/lominous-logo.png',
          link:'https://lominouswebapp.onrender.com',
          desc:'A personal safety web app covering route planning, live GPS tracking, SOS logging, and emergency contact management.',
          stack:['HTML / CSS / JS','XML','MySQL'],
          role:'Full-stack Developer',
          notes:'Schema built around route history, SOS event logs, and linked emergency contacts — structured so an SOS write is fast and simple to log first, with detail resolved after the fact rather than blocking the trigger.'
        },
        {
          name:'beteranos_barbershop_app',
          title:'Beteranos — Barbershop Booking App',
          status:'Built',
          logo:'assets/logos/beteranos-logo.png',
          screenshots:[
            {src:'assets/screenshots/beteranos/login.jpg', caption:'Landing screen — reserve or admin login'},
            {src:'assets/screenshots/beteranos/homepage.jpg', caption:'Home — gallery, barber, and product categories'},
            {src:'assets/screenshots/beteranos/products.jpg', caption:'Product catalog with stock and pricing'},
            {src:'assets/screenshots/beteranos/reservation.jpg', caption:'Barber selection during reservation flow'}
          ],
          desc:'A native Android app for a barbershop, handling appointment booking, staff showcase, a small retail catalog, and a style gallery, built on the Jetpack Navigation Component.',
          stack:['Android (Java / Kotlin)','Jetpack Navigation','Single-Activity Architecture'],
          role:'Android Developer',
          notes:'Reservation, staff profile, product, gallery, and reviews handled as separate fragments. Reviews and Notifications are gated behind CustomerLoginActivity for guests.'
        },
        {
          name:'electbudz_voting_system',
          title:'ElectBudz — Desktop Voting Application',
          status:'Built',
          logo:'assets/logos/electbudz-logo.png',
          screenshots:[
            {src:'assets/screenshots/electbudz/login.jpg', caption:'Login screen — voter sign-in with admin panel access', wide:true},
            {src:'assets/screenshots/electbudz/admin-panel.png', caption:'Admin panel — manage candidates, set voter count, start election', wide:true},
            {src:'assets/screenshots/electbudz/voting.png', caption:'Ballot screen — voter selects candidates per position', wide:true},
            {src:'assets/screenshots/electbudz/results.png', caption:'Election results — live vote tally and percentage breakdown per position', wide:true}
          ],
          desc:'A Java Swing desktop voting application connecting to a MySQL voters database, with authenticated login, duplicate-vote prevention, and a gender-aware voter profile screen.',
          stack:['Java Swing','Maven / NetBeans','MySQL (JDBC)'],
          role:'Desktop Application Developer',
          notes:'Login validates against a voters table and blocks users who have already voted. Profile screen re-themes its border, background, and header gradient based on the voter\'s gender.'
        }
      ],
      gamedev:[
        {
          title:'3D Third-Person Combat Prototype',
          engine:'Unity (URP)',
          desc:"A CODM-style third-person camera setup with a Knight player character (Mixamo animations) and a Simple Skeleton enemy, using Rigidbody-based terrain collision.",
          tags:['Unity URP','Mixamo','Rigidbody Physics','Third-person Camera']
        },
        {
          title:'MyFirst2DGame_Gagui',
          engine:'Unity (2D)',
          desc:"A 2D platformer built with Unity's New Input System and SPUM character integration, featuring parallax backgrounds and a shipped Android APK build.",
          tags:['New Input System','SPUM','Parallax','Android Build']
        }
      ],
      interests:['System Design & Architecture', 'Database Design & Querying', 'Web Development (PHP, JS, HTML, CSS)'],
      stack:[
        {label:'Backend', items:['PHP','MVC Architecture','Visual Basic .NET']},
        {label:'Database', items:['MySQL','MyISAM','Schema Design','SQL Querying']},
        {label:'Web / Frontend', items:['Vue.js','JavaScript','HTML5','CSS3']},
        {label:'Game Dev', items:['Unity (2D & 3D)','C#','URP','New Input System']},
        {label:'Mobile Dev', items:['Android (Java / Kotlin)','Jetpack Navigation Component']},
        {label:'Desktop Dev', items:['Java','Java Swing','Maven','NetBeans']},
        {label:'Tooling', items:['XAMPP','VS Code','Git / GitHub','Node.js']},
        {label:'Deployment', items:['Firebase Hosting','Render','InfinityFree','Static / Shared Hosting']}
      ],
      migrations:[
        {ver:'v001', date:'Built', title:'electbudz_voting_system', desc:'Java Swing desktop voting app on Maven/NetBeans, with MySQL-backed voter authentication, duplicate-vote checks, and gender-themed profile screens.'},
        {ver:'v002', date:'Built', title:'beteranos_barbershop_app', desc:'Native Android booking app for a barbershop, built on Jetpack Navigation with fragment-based booking, staff, retail, gallery, and review systems.'},
        {ver:'v003', date:'Built', title:'lominous_safety_companion', desc:'Full-stack safety companion app with route planning, GPS tracking, SOS logging, and an emergency-contacts MySQL schema.'},
        {ver:'v004', date:'Coursework', title:'vb_receipt_component_review', desc:'Code review of a Visual Basic .NET receipt rendering component for a bookstore POS app, comparing on-screen preview output against generated PDF output.'},
        {ver:'v005', date:'Coursework', title:'ws101_agebracket_form', desc:'PHP form project handling submission workflow and age-bracket logic, built with XAMPP and styled with an external dark-theme stylesheet.'},
        {ver:'v006', date:'Coursework', title:'dynweb_teacher_management', desc:'PHP teacher and user management app hosted on InfinityFree, with a dark blue UI theme. Resolved routing, database connection, and layout issues.'},
        {ver:'v007', date:'Coursework', title:'unity_2d_3d_prototypes', desc:'Built a 2D platformer (New Input System, SPUM, Android build) and a 3D third-person combat prototype (URP, Mixamo, Rigidbody physics) in Unity.'},
        {ver:'v008', date:'Built', title:'lokalkusinero_schema', desc:'Designed a nine-table MyISAM schema for a Filipino recipe and pantry app, with a validated canonical seed of thirty recipes.'},
        {ver:'v009', date:'In Progress', title:'complaint_management_ai_assistant', desc:'Backend development on the primary capstone project, from Chapter 1 and Resource Matrix documentation through system implementation.', head:true}
      ]
    }
  },
  methods:{
    openLightbox(images, index){
      this.lightbox.images = images;
      this.lightbox.index = index;
      this.lightbox.open = true;
      document.body.style.overflow = 'hidden';
    },
    closeLightbox(){
      this.lightbox.open = false;
      document.body.style.overflow = '';
    },
    nextImage(){
      this.lightbox.index = (this.lightbox.index + 1) % this.lightbox.images.length;
    },
    prevImage(){
      this.lightbox.index = (this.lightbox.index - 1 + this.lightbox.images.length) % this.lightbox.images.length;
    },
    onLightboxKeydown(e){
      if(!this.lightbox.open) return;
      if(e.key === 'Escape') this.closeLightbox();
      if(e.key === 'ArrowRight' && this.lightbox.images.length > 1) this.nextImage();
      if(e.key === 'ArrowLeft' && this.lightbox.images.length > 1) this.prevImage();
    },
    runBootSequence(){
      document.body.classList.add('boot-lock');
      const stepDelay = 220;
      const total = this.bootLines.length;
      this.bootLines.forEach((line, i)=>{
        setTimeout(()=>{
          this.visibleBootLines.push(line);
          this.bootProgress = Math.round(((i+1)/total)*100);
        }, i*stepDelay);
      });
      const finishDelay = total*stepDelay + 500;
      setTimeout(()=>{
        this.booting = false;
        document.body.classList.remove('boot-lock');
        setTimeout(()=>{ this.bootDone = true; }, 700);
      }, finishDelay);
    }
  },
  mounted(){
    this.runBootSequence();
    window.addEventListener('keydown', this.onLightboxKeydown);
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, {threshold:0.15});
    els.forEach(el=>obs.observe(el));
  }
}).mount('#app');
