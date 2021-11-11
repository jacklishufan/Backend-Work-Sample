// Backend Logic
// Since this is a very small scale demo, no need to have uuid and so forth, everything will be stored in a single list
import { CloudflareWorkerKV } from 'types-cloudflare-worker';
import { v4 as uuid } from 'uuid';
// Declare a Named KV in the global scope. ref:
// https://developers.cloudflare.com/workers/kv/api/

// The name the KV is used to help you identify the namespace and must be unique
// within your account for this demo, we use countryCodeKV to represent the KV
// to store country code info.
declare global {
  const POST_DB: CloudflareWorkerKV;
}
export default class Postsprovider {
  async list() {
    let posts = JSON.parse(await POST_DB.get('posts'))
    posts = posts || [] // In case of Null
    return posts
  }
  async save(lst) {
    await POST_DB.put('posts',JSON.stringify(lst))
    return
  }

  async delete(lst) {
    await this.save([])
    return
  }

  async add(payload) {
    let posts =await this.list()
    posts = posts || [] // In case of Null
    posts.push({
      type:'text',
      ...payload,
      uuid:uuid(),
      comments:[],
      reactions:{

      }
    })
    await this.save(posts)
    return 
  }
  
  async comment(uuid,payload) {
    let posts =await this.list()
    posts = posts.map(
      e=>{
        if (e.uuid == uuid) {
          let comments = e.comments || []
          comments.push(payload)
          e.comments = comments
        }
        return e
      }
    )
    await this.save(posts)
  }

  async respond(uuid,key) {
    let posts =await this.list()
    posts = posts.map(
      e=>{
        if (e.uuid == uuid) {
          let reactions = e.reactions || {}
          let curr_val = reactions[key] || 0
          reactions[key] = curr_val + 1
          e.reactions = reactions
        }
        return e
      }
    )
    await this.save(posts)
  }

  validate(payload) {
    let errors = ["title", "username", "content" ]
    errors = errors.filter(e=>!(payload[e] && payload[e]?.constructor === String)) // Assert fields are present and they cannot be 
    return errors.length == 0
  }
}