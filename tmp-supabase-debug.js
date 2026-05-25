require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
db.from('information_schema.columns').select('*').eq('table_name','rescuerequest').then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e); process.exit(1)});
