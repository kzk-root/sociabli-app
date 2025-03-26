import { createClient } from '@supabase/supabase-js'
import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'

const supabaseUrl = 'https://vfrxdkmshktkwvdvvrcx.supabase.co'
const supabaseKey = FunctionEnvVars.supabaseKey
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
