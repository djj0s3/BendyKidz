import {
  Article,
  Category,
  Testimonial,
  AboutContent,
  TeamMember,
  SiteStats,
  RelatedArticle
} from '@shared/schema';

// Fallback data for when Contentful is not properly configured
export const fallbackCategories: Category[] = [
  {
    id: 'fine-motor',
    name: 'Fine Motor Skills',
    slug: 'fine-motor',
    description: 'Resources for developing precision, hand strength, and coordination in small movements.'
  },
  {
    id: 'gross-motor',
    name: 'Gross Motor Skills',
    slug: 'gross-motor',
    description: 'Activities to improve coordination, strength, and control of large muscle groups.'
  },
  {
    id: 'sensory',
    name: 'Sensory Processing',
    slug: 'sensory',
    description: 'Tools and strategies for children with sensory processing challenges.'
  },
  {
    id: 'daily-living',
    name: 'Daily Living Skills',
    slug: 'daily-living',
    description: 'Practical assistance for developing independence in everyday activities.'
  }
];

export const fallbackAuthor = {
  id: 'author-1',
  name: 'Emma Wilson',
  avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
};

export const fallbackArticles: Article[] = [
  {
    id: 'article-1',
    title: 'Simple Exercises to Improve Pencil Grip',
    slug: 'improve-pencil-grip',
    excerpt: 'Learn effective exercises that help children develop the proper pencil grip for writing and drawing.',
    content: `
      <h2>Why Pencil Grip Matters</h2>
      <p>A proper pencil grip helps children write more comfortably and for longer periods without fatigue. It also improves handwriting quality and precision in drawing.</p>
      
      <h2>Exercises to Try at Home</h2>
      <ul>
        <li><strong>Pincer Grip Practice:</strong> Pick up small objects like beads or cereal using thumb and index finger.</li>
        <li><strong>Resistance Activities:</strong> Squeeze stress balls, play with therapy putty, or use clothespins.</li>
        <li><strong>Vertical Surfaces:</strong> Draw or color on paper taped to the wall to promote wrist extension.</li>
        <li><strong>Finger Exercises:</strong> Practice finger isolation with finger puppets or finger counting games.</li>
      </ul>
      
      <h2>Selecting the Right Tools</h2>
      <p>Consider using pencil grips, thicker pencils, or triangular crayons to help guide fingers into the correct position.</p>
      
      <h2>When to Seek Help</h2>
      <p>If your child continues to struggle with pencil grip despite practicing these exercises, consider consulting with an occupational therapist for personalized strategies.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    publishedDate: '2023-05-15',
    readingTime: 5,
    author: fallbackAuthor,
    category: fallbackCategories[0],
    tags: ['fine motor', 'writing', 'school readiness']
  },
  {
    id: 'article-2',
    title: 'The Benefits of Crawling for Development',
    slug: 'benefits-of-crawling',
    excerpt: 'Discover why crawling is a crucial developmental milestone and how it supports overall physical and cognitive growth.',
    content: `
      <h2>The Importance of Crawling</h2>
      <p>Crawling isn't just a way for babies to get from one place to another. This milestone movement pattern provides significant developmental benefits for children.</p>
      
      <h2>Physical Development Benefits</h2>
      <ul>
        <li><strong>Core Strength:</strong> Crawling builds trunk stability which is essential for later skills like sitting and standing.</li>
        <li><strong>Shoulder Stability:</strong> Weight-bearing through the arms strengthens shoulder muscles needed for fine motor tasks.</li>
        <li><strong>Bilateral Coordination:</strong> The cross-pattern movement of crawling helps coordinate the right and left sides of the body.</li>
        <li><strong>Hand-Eye Coordination:</strong> Looking where they're going while moving their hands helps develop visual tracking.</li>
      </ul>
      
      <h2>Cognitive Benefits</h2>
      <p>Crawling also supports brain development by:
      <ul>
        <li>Integrating both hemispheres of the brain</li>
        <li>Developing spatial awareness</li>
        <li>Building problem-solving skills as babies navigate around obstacles</li>
        <li>Enhancing memory as they learn to remember where objects or people are located</li>
      </ul>
      </p>
      
      <h2>Supporting Your Child's Crawling</h2>
      <p>Even if your child has started walking, crawling games and activities can still be beneficial. Try creating obstacle courses, playing tunnel games, or having "crawling races" to encourage this important movement pattern.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1596778702291-3d6d4a46b3c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    publishedDate: '2023-06-03',
    readingTime: 7,
    author: fallbackAuthor,
    category: fallbackCategories[1],
    tags: ['gross motor', 'infant development', 'movement']
  },
  {
    id: 'article-3',
    title: 'Creating a Sensory-Friendly Home Environment',
    slug: 'sensory-friendly-home',
    excerpt: 'Practical tips for adapting your home to support a child with sensory processing differences.',
    content: `
      <h2>Understanding Sensory Needs</h2>
      <p>Children with sensory processing differences may be over-responsive or under-responsive to sensory input. Creating a sensory-friendly home means providing the right level of stimulation.</p>
      
      <h2>Visual Accommodations</h2>
      <ul>
        <li><strong>Reduce Clutter:</strong> Keep visual spaces clean and organized to avoid overwhelming visual input.</li>
        <li><strong>Consider Lighting:</strong> Natural light is typically best, but dimmer switches can help adjust artificial lighting.</li>
        <li><strong>Color Choices:</strong> Soft, muted colors are often less stimulating than bright, bold ones.</li>
      </ul>
      
      <h2>Auditory Adaptations</h2>
      <ul>
        <li><strong>Minimize Background Noise:</strong> Turn off unnecessary appliances or TV when not in use.</li>
        <li><strong>Soft Surfaces:</strong> Rugs, curtains, and soft furniture can reduce echo and absorb sound.</li>
        <li><strong>Noise-Cancelling Headphones:</strong> Have these available for times when noise is unavoidable.</li>
      </ul>
      
      <h2>Tactile Considerations</h2>
      <ul>
        <li><strong>Comfortable Clothing:</strong> Pay attention to tags, seams, and fabric textures.</li>
        <li><strong>Varied Textures:</strong> Provide different textured items for exploration and comfort.</li>
        <li><strong>Cozy Retreat:</strong> Create a soft, comfortable space where your child can go when feeling overwhelmed.</li>
      </ul>
      
      <h2>Movement Opportunities</h2>
      <p>Even in a small home, providing safe spaces for jumping, swinging, or crashing can help children regulate their sensory systems.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    publishedDate: '2023-04-22',
    readingTime: 8,
    author: fallbackAuthor,
    category: fallbackCategories[2],
    tags: ['sensory processing', 'home adaptations', 'environmental strategies']
  },
  {
    id: 'article-4',
    title: 'Supporting Independent Dressing Skills',
    slug: 'independent-dressing',
    excerpt: 'Strategies to help your child develop the confidence and skills needed for dressing independently.',
    content: `
      <h2>The Developmental Progression of Dressing</h2>
      <p>Dressing skills develop in a predictable sequence. Understanding this progression helps you know what to expect and when to introduce different skills.</p>
      
      <h2>Developmental Timeline</h2>
      <ul>
        <li><strong>18-24 months:</strong> Removes simple garments, helps with dressing by pushing arms through sleeves</li>
        <li><strong>2-3 years:</strong> Puts on loose clothing, manages large buttons, removes shoes</li>
        <li><strong>3-4 years:</strong> Puts on t-shirts, manages zippers, puts on shoes (may be wrong feet)</li>
        <li><strong>4-5 years:</strong> Distinguishes front from back, fastens most closures, ties loose knots</li>
        <li><strong>5-6 years:</strong> Dresses independently, begins to tie shoelaces</li>
      </ul>
      
      <h2>Tips for Supporting Success</h2>
      <ul>
        <li><strong>Allow Extra Time:</strong> Schedule plenty of time for dressing so there's no rush.</li>
        <li><strong>Choose Accessible Clothing:</strong> Start with loose-fitting clothes that have minimal or easy-to-manage fasteners.</li>
        <li><strong>Break It Down:</strong> Teach one step at a time rather than the whole dressing process at once.</li>
        <li><strong>Use Visual Supports:</strong> Picture sequences can help children remember the steps.</li>
        <li><strong>Practice Regularly:</strong> Consistent practice during non-rushed times builds confidence.</li>
      </ul>
      
      <h2>Adaptations for Success</h2>
      <p>If your child struggles with traditional fasteners, consider clothing with:
      <ul>
        <li>Elastic waistbands</li>
        <li>Velcro closures</li>
        <li>Larger buttons or zipper pulls</li>
        <li>Slip-on shoes until lacing skills develop</li>
      </ul>
      </p>
      
      <h2>Celebrating Progress</h2>
      <p>Remember to acknowledge and celebrate each small step toward independence, not just complete mastery.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    publishedDate: '2023-07-10',
    readingTime: 6,
    author: fallbackAuthor,
    category: fallbackCategories[3],
    tags: ['daily living', 'self-care', 'independence']
  },
  {
    id: 'article-5',
    title: 'Developing Scissor Skills Through Play',
    slug: 'scissor-skills-through-play',
    excerpt: 'Fun activities to help children master scissor skills while building hand strength and coordination.',
    content: `
      <h2>When to Introduce Scissors</h2>
      <p>Children are typically ready to begin learning scissor skills around 2-3 years of age, starting with simple snips. Full competency usually develops between 4-6 years.</p>
      
      <h2>Pre-Scissor Activities</h2>
      <p>Before introducing actual scissors, build hand strength and coordination with:</p>
      <ul>
        <li><strong>Tearing Paper:</strong> Start with thin paper like tissue paper and progress to construction paper.</li>
        <li><strong>Hole Punchers:</strong> Single-hole punchers require similar hand movements and strength.</li>
        <li><strong>Squirt Bottles:</strong> Water play with spray bottles builds the same muscles.</li>
        <li><strong>Tweezers Games:</strong> Picking up small objects with tweezers develops precision.</li>
      </ul>
      
      <h2>Choosing the Right Scissors</h2>
      <p>Select scissors that match your child's developmental stage:</p>
      <ul>
        <li><strong>Spring-Assist Scissors:</strong> Best for beginners as they automatically reopen.</li>
        <li><strong>Loop Scissors:</strong> Allow for adult hand-over-hand assistance.</li>
        <li><strong>Training Scissors:</strong> Smaller size with blunter tips for safety.</li>
        <li><strong>Left-Handed Scissors:</strong> Essential for left-handed children.</li>
      </ul>
      
      <h2>Fun Cutting Activities</h2>
      <ul>
        <li><strong>Fringe Cutting:</strong> Cut strips along the edge of paper to create grass, hair, or a lion's mane.</li>
        <li><strong>Playdough Scissors:</strong> Cutting playdough offers resistance that builds strength.</li>
        <li><strong>Collage Creation:</strong> Cut pictures from magazines to create a themed collage.</li>
        <li><strong>Secret Messages:</strong> Cut along lines to reveal hidden pictures or messages.</li>
        <li><strong>Cutting Station:</strong> Create a special area with interesting materials to cut: straws, fabric scraps, cards.</li>
      </ul>
      
      <h2>Safety Reminders</h2>
      <p>Always supervise scissor activities and teach proper carrying techniques: closed blades, pointed end down, and in the non-dominant hand when walking.</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    publishedDate: '2023-05-30',
    readingTime: 7,
    author: fallbackAuthor,
    category: fallbackCategories[0],
    tags: ['fine motor', 'craft activities', 'school readiness']
  },
  {
    id: 'article-6',
    title: 'The Power of Outdoor Play for Sensory Development',
    slug: 'outdoor-play-sensory-development',
    excerpt: 'How nature provides the perfect sensory-rich environment for children\'s development and regulation.',
    content: `
      <h2>Nature as a Sensory Classroom</h2>
      <p>The outdoors offers unmatched opportunities for sensory exploration. Unlike carefully controlled indoor environments, nature provides a full spectrum of sensory input in a rich, organically balanced way.</p>
      
      <h2>Vestibular and Proprioceptive Input</h2>
      <p>The uneven terrain of outdoor environments naturally challenges balance and body awareness:</p>
      <ul>
        <li><strong>Climbing Trees:</strong> Requires motor planning, body awareness, and core strength.</li>
        <li><strong>Walking on Different Surfaces:</strong> From soft grass to crunchy gravel, each surface provides different feedback to the body.</li>
        <li><strong>Hills and Slopes:</strong> Provide natural challenges to balance systems.</li>
      </ul>
      
      <h2>Tactile Stimulation</h2>
      <p>Nature offers unlimited tactile experiences:</p>
      <ul>
        <li><strong>Textures:</strong> Rough bark, smooth stones, sticky sap, soft moss.</li>
        <li><strong>Temperatures:</strong> Cool streams, warm sun, damp morning grass.</li>
        <li><strong>Natural Sensory Bins:</strong> Dirt, sand, mud, and water provide perfect mediums for deep tactile play.</li>
      </ul>
      
      <h2>Visual and Auditory Benefits</h2>
      <ul>
        <li><strong>Depth Perception:</strong> Focusing on objects at varying distances strengthens visual systems.</li>
        <li><strong>Natural Sounds:</strong> Birds, rustling leaves, and flowing water provide non-overwhelming auditory input.</li>
        <li><strong>Visual Rest:</strong> Natural landscapes allow eyes to relax from the fixed-distance focus of screens and indoor environments.</li>
      </ul>
      
      <h2>Outdoor Activities for Sensory Regulation</h2>
      <ul>
        <li><strong>Barefoot Walking:</strong> Create a sensory path with different natural materials.</li>
        <li><strong>Mud Kitchen:</strong> Combine tactile play with imaginary play for rich sensory experiences.</li>
        <li><strong>Garden Work:</strong> Digging, planting, and watering engage multiple senses simultaneously.</li>
        <li><strong>Cloud Watching:</strong> A calming activity that can help with visual tracking.</li>
      </ul>
      
      <h2>All-Weather Benefits</h2>
      <p>Don't limit outdoor play to perfect weather days. Rain, snow, and varying temperatures offer unique sensory experiences. As the Scandinavian saying goes, "There's no such thing as bad weather, only inappropriate clothing."</p>
    `,
    featuredImage: 'https://images.unsplash.com/photo-1502781252888-9143ba7f074e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    publishedDate: '2023-06-27',
    readingTime: 8,
    author: fallbackAuthor,
    category: fallbackCategories[2],
    tags: ['sensory processing', 'outdoor activities', 'nature play']
  }
];

export const fallbackFeaturedArticles: Article[] = [
  fallbackArticles[0],
  fallbackArticles[2],
  fallbackArticles[5]
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Sarah Johnson',
    role: 'Parent of Alex, 7',
    quote: 'The resources from BendyKidz have completely transformed our daily routine. The practical strategies have helped my son develop independence with dressing and self-care activities.',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
  },
  {
    id: 'testimonial-2',
    name: 'Michael Chen',
    role: 'Parent of Lily, 5',
    quote: 'As a parent with no background in child development, I found the articles incredibly accessible and easy to implement. The sensory activities have made a huge difference for my daughter.',
    avatar: 'https://randomuser.me/api/portraits/men/25.jpg'
  },
  {
    id: 'testimonial-3',
    name: 'Jessica Rivera',
    role: 'Early Childhood Educator',
    quote: 'I recommend BendyKidz resources to all the families I work with. The evidence-based information is presented in such a practical, parent-friendly way.',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg'
  }
];

export const fallbackAboutContent: AboutContent = {
  title: "About BendyKidz Occupational Therapy",
  subtitle: "Empowering children through play-based therapy and parent education",
  description: "<p>BendyKidz Occupational Therapy was founded by Emma Wilson, a pediatric occupational therapist with over 15 years of experience working with children of all abilities.</p><p>After years of clinical practice, Emma recognized that families needed more accessible resources to continue supporting their children's development at home. This website was created to bridge that gap – providing evidence-based information and practical strategies in an easy-to-implement format.</p><p>At BendyKidz, we believe that therapy doesn't only happen in a clinical setting but continues at home through play and daily activities. Our mission is to empower parents with the knowledge and tools to support their children's development.</p>",
  mission: "<p>Our mission is to make a meaningful difference in children's lives through evidence-based practices, play-based learning, and family-centered care. We believe in making therapeutic strategies accessible to all families, regardless of their location or resources.</p>",
  image: "https://images.unsplash.com/photo-1516627145497-ae6968895b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  imageAlt: "Occupational therapist working with child on fine motor skills"
};

export const fallbackTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Emma Wilson',
    role: 'Founder & Lead Occupational Therapist',
    bio: 'Emma has over 15 years of experience working with children with diverse needs and abilities. With a Master\'s degree in Occupational Therapy and specialized certifications in Sensory Integration and Pediatric Development, Emma brings a wealth of knowledge and practical experience to help children thrive. Her approach combines evidence-based practices with a playful, family-centered philosophy that empowers parents to support their children\'s development at home.',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
  }
];

export const fallbackSiteStats: SiteStats = {
  resources: 25,
  specialists: 1,
  activityTypes: 4
};

export function getRelatedArticlesFallback(articleId: string, categoryId: string): RelatedArticle[] {
  // Filter articles in the same category but not the current article
  return fallbackArticles
    .filter(article => article.category.id === categoryId && article.id !== articleId)
    .slice(0, 3)
    .map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage
    }));
}

export function getArticlesByCategoryFallback(categoryId: string): Article[] {
  return fallbackArticles.filter(article => article.category.id === categoryId);
}

export function getArticleBySlugFallback(slug: string): Article | null {
  return fallbackArticles.find(article => article.slug === slug) || null;
}

export function getCategoryBySlugFallback(slug: string): Category | null {
  return fallbackCategories.find(category => category.slug === slug) || null;
}