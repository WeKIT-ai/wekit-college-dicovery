import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CollegeData {
  name: string
  official_name?: string
  city: string
  state: string
  institution_type?: string
  college_type?: string
  establishment_year?: number
  website_url?: string
  nirf_ranking?: number
  data_source: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { source = 'nirf' } = await req.json()

    console.log(`Starting college data scraping from source: ${source}`)

    let colleges: CollegeData[] = []

    if (source === 'nirf') {
      colleges = await scrapeNIRFData()
    } else if (source === 'ugc') {
      colleges = await scrapeUGCData()
    }

    console.log(`Found ${colleges.length} colleges to process`)

    // Insert colleges in batches
    const batchSize = 100
    let insertedCount = 0

    for (let i = 0; i < colleges.length; i += batchSize) {
      const batch = colleges.slice(i, i + batchSize)
      
      const { data, error } = await supabaseClient
        .from('colleges')
        .upsert(batch, { 
          onConflict: 'name,city,state',
          ignoreDuplicates: true 
        })

      if (error) {
        console.error(`Error inserting batch ${i}-${i + batchSize}:`, error)
      } else {
        insertedCount += batch.length
        console.log(`Inserted batch ${i}-${i + batchSize}, total: ${insertedCount}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully processed ${colleges.length} colleges, inserted ${insertedCount}`,
        source
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in scrape-colleges function:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

async function scrapeNIRFData(): Promise<CollegeData[]> {
  console.log('Scraping NIRF data...')
  
  // Sample NIRF data - in production this would scrape from actual NIRF website
  const nirfColleges: CollegeData[] = [
    {
      name: "Indian Institute of Technology Madras",
      official_name: "IIT Madras",
      city: "Chennai",
      state: "Tamil Nadu",
      institution_type: "Government",
      college_type: "Engineering",
      establishment_year: 1959,
      website_url: "https://www.iitm.ac.in",
      nirf_ranking: 1,
      data_source: "NIRF 2024"
    },
    {
      name: "Indian Institute of Science",
      official_name: "IISc Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      institution_type: "Government",
      college_type: "Research Institute",
      establishment_year: 1909,
      website_url: "https://www.iisc.ac.in",
      nirf_ranking: 2,
      data_source: "NIRF 2024"
    },
    {
      name: "Indian Institute of Technology Bombay",
      official_name: "IIT Bombay",
      city: "Mumbai",
      state: "Maharashtra",
      institution_type: "Government",
      college_type: "Engineering",
      establishment_year: 1958,
      website_url: "https://www.iitb.ac.in",
      nirf_ranking: 3,
      data_source: "NIRF 2024"
    },
    {
      name: "Indian Institute of Technology Delhi",
      official_name: "IIT Delhi",
      city: "New Delhi",
      state: "Delhi",
      institution_type: "Government",
      college_type: "Engineering",
      establishment_year: 1961,
      website_url: "https://www.iitd.ac.in",
      nirf_ranking: 4,
      data_source: "NIRF 2024"
    },
    {
      name: "Indian Institute of Technology Kanpur",
      official_name: "IIT Kanpur",
      city: "Kanpur",
      state: "Uttar Pradesh",
      institution_type: "Government",
      college_type: "Engineering",
      establishment_year: 1959,
      website_url: "https://www.iitk.ac.in",
      nirf_ranking: 5,
      data_source: "NIRF 2024"
    },
    {
      name: "All India Institute of Medical Sciences",
      official_name: "AIIMS Delhi",
      city: "New Delhi",
      state: "Delhi",
      institution_type: "Government",
      college_type: "Medical",
      establishment_year: 1956,
      website_url: "https://www.aiims.edu",
      nirf_ranking: 1,
      data_source: "NIRF 2024 Medical"
    },
    {
      name: "Jawaharlal Nehru University",
      official_name: "JNU",
      city: "New Delhi",
      state: "Delhi",
      institution_type: "Government",
      college_type: "University",
      establishment_year: 1969,
      website_url: "https://www.jnu.ac.in",
      nirf_ranking: 2,
      data_source: "NIRF 2024 University"
    },
    {
      name: "University of Delhi",
      official_name: "Delhi University",
      city: "New Delhi",
      state: "Delhi",
      institution_type: "Government",
      college_type: "University",
      establishment_year: 1922,
      website_url: "https://www.du.ac.in",
      nirf_ranking: 11,
      data_source: "NIRF 2024 University"
    },
    {
      name: "Banaras Hindu University",
      official_name: "BHU",
      city: "Varanasi",
      state: "Uttar Pradesh",
      institution_type: "Government",
      college_type: "University",
      establishment_year: 1916,
      website_url: "https://www.bhu.ac.in",
      nirf_ranking: 12,
      data_source: "NIRF 2024 University"
    },
    {
      name: "Aligarh Muslim University",
      official_name: "AMU",
      city: "Aligarh",
      state: "Uttar Pradesh",
      institution_type: "Government",
      college_type: "University",
      establishment_year: 1875,
      website_url: "https://www.amu.ac.in",
      nirf_ranking: 17,
      data_source: "NIRF 2024 University"
    }
  ]

  // Add more sample data for different states
  const stateColleges = generateStateColleges()
  
  return [...nirfColleges, ...stateColleges]
}

async function scrapeUGCData(): Promise<CollegeData[]> {
  console.log('Scraping UGC data...')
  
  // Sample UGC recognized colleges data
  return [
    {
      name: "Fergusson College",
      city: "Pune",
      state: "Maharashtra",
      institution_type: "Private",
      college_type: "Arts and Science",
      establishment_year: 1885,
      data_source: "UGC Recognized"
    },
    {
      name: "Presidency College",
      city: "Kolkata",
      state: "West Bengal",
      institution_type: "Government",
      college_type: "Arts and Science",
      establishment_year: 1817,
      data_source: "UGC Recognized"
    },
    {
      name: "St. Xavier's College",
      city: "Mumbai",
      state: "Maharashtra",
      institution_type: "Private",
      college_type: "Arts and Science",
      establishment_year: 1869,
      data_source: "UGC Recognized"
    }
  ]
}

function generateStateColleges(): CollegeData[] {
  const stateData = [
    { state: "Andhra Pradesh", cities: ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"] },
    { state: "Assam", cities: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"] },
    { state: "Bihar", cities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"] },
    { state: "Chhattisgarh", cities: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"] },
    { state: "Gujarat", cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"] },
    { state: "Haryana", cities: ["Gurugram", "Faridabad", "Hisar", "Karnal", "Ambala"] },
    { state: "Himachal Pradesh", cities: ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"] },
    { state: "Jharkhand", cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"] },
    { state: "Karnataka", cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"] },
    { state: "Kerala", cities: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kannur"] },
    { state: "Madhya Pradesh", cities: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"] },
    { state: "Maharashtra", cities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"] },
    { state: "Odisha", cities: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"] },
    { state: "Punjab", cities: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"] },
    { state: "Rajasthan", cities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"] },
    { state: "Tamil Nadu", cities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"] },
    { state: "Telangana", cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"] },
    { state: "Uttar Pradesh", cities: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"] },
    { state: "West Bengal", cities: ["Kolkata", "Siliguri", "Durgapur", "Asansol", "Howrah"] }
  ]

  const collegeTypes = ["Engineering", "Medical", "Arts and Science", "Commerce", "Law", "Management"]
  const institutionTypes = ["Government", "Private", "Autonomous"]
  
  const colleges: CollegeData[] = []
  
  stateData.forEach(({ state, cities }) => {
    cities.forEach(city => {
      // Generate 2-4 colleges per city
      const numColleges = Math.floor(Math.random() * 3) + 2
      
      for (let i = 0; i < numColleges; i++) {
        const collegeType = collegeTypes[Math.floor(Math.random() * collegeTypes.length)]
        const institutionType = institutionTypes[Math.floor(Math.random() * institutionTypes.length)]
        const establishmentYear = 1950 + Math.floor(Math.random() * 70)
        
        colleges.push({
          name: `${city} ${collegeType} College`,
          city,
          state,
          institution_type: institutionType,
          college_type: collegeType,
          establishment_year: establishmentYear,
          data_source: "Generated Data"
        })
      }
    })
  })
  
  return colleges
}