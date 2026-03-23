const cache = new Map()

const fetchText = async url => {
    if (cache.has(url))
        return cache.get(url)
    const text = await fetch(url).then(r => r.text())
    cache.set(url, text)
    return text
}

const renderFromTxt = async (url, templateSelector, target) => {
    const text = await fetchText(url)
    const blocks = text.trim().split(/\n\s*\n/)
    const headers = blocks[0].split(/\r?\n/).map(v => v.trim())
    const template = document.querySelector(templateSelector)
    blocks.slice(1).forEach(block => {
        const values = block.split(/\r?\n/).map(v => v.trim())
        const data = Object.fromEntries(headers.map((h,i)=>[h,values[i]]))
        const node = template.content.cloneNode(true)
        const root = node.firstElementChild
        const els = [
            ...(root.hasAttribute('data-field') ? [root] : []),
            ...root.querySelectorAll('[data-field]')
        ]
        els.forEach(el=>{
            el.dataset.field.trim().split(/\s+/).forEach(pair=>{
                const [prop,key] = pair.split(':')
                const path = prop.split('.')
                let obj = el
                path.slice(0,-1).forEach(p=>obj=obj[p])
                const name = path.at(-1)
                const value = data[key] ?? ''
                obj[name] = name === 'backgroundImage' ? `url(${value})` : value
            })
        })
        target.appendChild(node)
    })
}

const pages = document.querySelectorAll('.page')

const route = () => {
    const name = location.hash.slice(1) || 'home'
    const page = document.querySelector(`.page.${name}`)
    if (!page) {
        location.hash = 'home'
        return
    }
    page.querySelectorAll('[data-src]').forEach(el=>{
        if (el.childElementCount) return
        renderFromTxt(el.dataset.src, el.dataset.template, el)
    })
    pages.forEach(p=>p.classList.add('hide'))
    page.classList.remove('hide')
    document.body.scrollTop = 0
}

window.addEventListener('hashchange', route)
window.addEventListener('load', route)

/////////////////////////////////////////////////////////////////////////////

const icons = {
    apps: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M183.5-183.5Q160-207 160-240t23.5-56.5Q207-320 240-320t56.5 23.5Q320-273 320-240t-23.5 56.5Q273-160 240-160t-56.5-23.5Zm240 0Q400-207 400-240t23.5-56.5Q447-320 480-320t56.5 23.5Q560-273 560-240t-23.5 56.5Q513-160 480-160t-56.5-23.5Zm240 0Q640-207 640-240t23.5-56.5Q687-320 720-320t56.5 23.5Q800-273 800-240t-23.5 56.5Q753-160 720-160t-56.5-23.5Zm-480-240Q160-447 160-480t23.5-56.5Q207-560 240-560t56.5 23.5Q320-513 320-480t-23.5 56.5Q273-400 240-400t-56.5-23.5Zm240 0Q400-447 400-480t23.5-56.5Q447-560 480-560t56.5 23.5Q560-513 560-480t-23.5 56.5Q513-400 480-400t-56.5-23.5Zm240 0Q640-447 640-480t23.5-56.5Q687-560 720-560t56.5 23.5Q800-513 800-480t-23.5 56.5Q753-400 720-400t-56.5-23.5Zm-480-240Q160-687 160-720t23.5-56.5Q207-800 240-800t56.5 23.5Q320-753 320-720t-23.5 56.5Q273-640 240-640t-56.5-23.5Zm240 0Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Zm240 0Q640-687 640-720t23.5-56.5Q687-800 720-800t56.5 23.5Q800-753 800-720t-23.5 56.5Q753-640 720-640t-56.5-23.5Z"/></svg>',
    whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve" width="512" height="512"><g id="WA_Logo"><g><path style="fill-rule:evenodd;clip-rule:evenodd;" d="M20.463,3.488C18.217,1.24,15.231,0.001,12.05,0    C5.495,0,0.16,5.334,0.157,11.892c-0.001,2.096,0.547,4.142,1.588,5.946L0.057,24l6.304-1.654    c1.737,0.948,3.693,1.447,5.683,1.448h0.005c6.554,0,11.89-5.335,11.893-11.893C23.944,8.724,22.708,5.735,20.463,3.488z     M12.05,21.785h-0.004c-1.774,0-3.513-0.477-5.031-1.378l-0.361-0.214l-3.741,0.981l0.999-3.648l-0.235-0.374    c-0.99-1.574-1.512-3.393-1.511-5.26c0.002-5.45,4.437-9.884,9.889-9.884c2.64,0,5.122,1.03,6.988,2.898    c1.866,1.869,2.893,4.352,2.892,6.993C21.932,17.351,17.498,21.785,12.05,21.785z M17.472,14.382    c-0.297-0.149-1.758-0.868-2.031-0.967c-0.272-0.099-0.47-0.149-0.669,0.148s-0.767,0.967-0.941,1.166    c-0.173,0.198-0.347,0.223-0.644,0.074c-0.297-0.149-1.255-0.462-2.39-1.475c-0.883-0.788-1.48-1.761-1.653-2.059    s-0.018-0.458,0.13-0.606c0.134-0.133,0.297-0.347,0.446-0.521C9.87,9.97,9.919,9.846,10.019,9.647    c0.099-0.198,0.05-0.372-0.025-0.521C9.919,8.978,9.325,7.515,9.078,6.92c-0.241-0.58-0.486-0.501-0.669-0.51    C8.236,6.401,8.038,6.4,7.839,6.4c-0.198,0-0.52,0.074-0.792,0.372c-0.272,0.298-1.04,1.017-1.04,2.479    c0,1.463,1.065,2.876,1.213,3.074c0.148,0.198,2.095,3.2,5.076,4.487c0.709,0.306,1.263,0.489,1.694,0.626    c0.712,0.226,1.36,0.194,1.872,0.118c0.571-0.085,1.758-0.719,2.006-1.413c0.248-0.694,0.248-1.29,0.173-1.413    C17.967,14.605,17.769,14.531,17.472,14.382z"/></g></g></svg>'
}

document.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = icons[el.dataset.icon] || ''
})

const els = document.querySelectorAll('.page > *')
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        } else {
            entry.target.classList.remove('visible')
        }
    })
}, {
    threshold: 0
})

els.forEach(el => observer.observe(el))