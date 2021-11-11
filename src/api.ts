import Postsprovider from './postProvider'
const provider = new Postsprovider()
const helloworld = async (request) =>  {
    return new Response('Hello worker!', {
      headers: { 'content-type': 'text/plain' },
    })
}
const getposts = async () =>  {
    let data = await provider.list()
    const body = JSON.stringify(data)
    const headers = { 'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',}
    return new Response(body, { headers })
}

const makeposts = async (request) =>  {
  const contentType = request.headers.get("content-type") || "";
  const headers = { 'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',}
  if (contentType.includes("application/json")) {
    let data = {}
    try {
      data = await request.json();
    } catch {
      return new Response('Bad Request:Invalid JSON Format',{status:400,headers})
    }
    if (!provider.validate(data)){
       return new Response('Bad Request:Fields Missing or is of invalid format. ',{status:400,headers})
    }
    await provider.add(data)
    return new Response('Success',{status:200,headers})
  } else {
    return new Response('Bad Request:Invalid ContentType',{status:400,headers})
  }
}
const commentPost = async (request) =>  {
  const contentType = request.headers.get("content-type") || "";
  const headers = { 'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',}
  if (contentType.includes("application/json")) {
    let data:any = {}
    try {
      data = await request.json();
    } catch {
      return new Response('Bad Request:Invalid JSON Format',{status:400,headers})
    }
    if (!provider.validate(data)){
       return new Response('Bad Request:Post Fields Missing or is of invalid format. ',{status:400,headers})
    }
    if (!data.uuid) {
      return new Response('Bad Request:UUID Missing ',{status:400,headers})
    }
    await provider.comment(data.uuid,data)
    return new Response('Submitted',{status:200,headers})
  } else {
    return new Response('Bad Request:Invalid ContentType',{status:400,headers})
  }
}

const reactPost = async (request) =>  {
  const contentType = request.headers.get("content-type") || "";
  const headers = { 'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',}
  if (contentType.includes("application/json")) {
    let data:any = {}
    try {
      data = await request.json();
    } catch {
      return new Response('Bad Request:Invalid JSON Format',{status:400,headers})
    }
    if (!data.uuid) {
      return new Response('Bad Request:UUID Missing ',{status:400,headers})
    }
    if (!data.key) {
      return new Response('Bad Request:UUID Missing ',{status:400,headers})
    }
    await provider.respond(data?.uuid,data?.key)
    return new Response('Submitted',{status:200,headers})
  } else {
    return new Response('Bad Request:Invalid ContentType',{status:400,headers})
  }
}

export {helloworld, getposts, makeposts,commentPost,reactPost}