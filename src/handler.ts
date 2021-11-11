import { Router } from 'itty-router'
import  {getposts, makeposts,commentPost,reactPost} from './api'
const router = Router()
router
  .get('/posts', getposts)
  .post('/posts', makeposts)
  .post('/comments', commentPost)
  .post('/react', reactPost)
  .get('*', () => new Response("Not found", { status: 404 }))


export default async function handleRequest(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    // Handle CORS preflight requests
    const headers = { 'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "200000",
    "Access-Control-Allow-Headers": '*',
     }
    return new Response(null,{headers:headers,})
  }
  return router.handle(request)
}
