from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    results=[]
    for width,height in [(1440,900),(390,844)]:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto('http://localhost:3000',wait_until='networkidle')
        page.locator('#stack').scroll_into_view_if_needed()
        page.wait_for_timeout(1600)
        assert page.locator('.workshop-index-group>button').count()==15
        assert page.locator('.workshop-category-tabs [role=tab]').count()==4
        assert page.locator('.workshop-detail-name').inner_text()=='React'
        # Check concrete possible overlap of nodes and detail stage.
        boxes=page.locator('.workshop-node').evaluate_all('(nodes)=>nodes.map(e=>({name:e.innerText,r:e.getBoundingClientRect().toJSON()}))')
        core=page.locator('.workshop-core').bounding_box()
        for node in boxes:
            r=node['r']
            overlap=min(r['right'],core['x']+core['width'])-max(r['left'],core['x'])>5 and min(r['bottom'],core['y']+core['height'])-max(r['top'],core['y'])>5
            assert not overlap,(width,node,core)
        page.get_by_role('tab',name=__import__("re").compile("Backend")).click()
        page.wait_for_timeout(1200)
        assert page.locator('.workshop-detail-name').inner_text()=='Node.js'
        page.get_by_role('button',name='Inspect Laravel',exact=True).click()
        page.wait_for_timeout(800)
        assert page.locator('.workshop-detail-name').inner_text()=='Laravel'
        page.get_by_role('tab',name=__import__("re").compile("Backend")).focus()
        page.keyboard.press('ArrowRight')
        page.wait_for_timeout(800)
        assert page.locator('.workshop-detail-name').inner_text()=='Flutter'
        page.locator('.workshop-tool-index').get_by_role('button',name='Augmented reality',exact=True).click()
        page.wait_for_timeout(800)
        assert page.locator('.workshop-detail-name').inner_text()=='Augmented reality'
        images=page.locator('.workshop-tool-index img').evaluate_all('(images)=>images.map(e=>({src:e.getAttribute("src"),loaded:e.complete&&e.naturalWidth>0}))')
        assert all(image['loaded'] for image in images),images
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
        assert not errors,errors
        results.append({'viewport':[width,height],'tools':15,'icons_loaded':len(images),'interactions':'pass'})
        page.close()
    page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
    page.goto('http://localhost:3000',wait_until='networkidle')
    page.locator('#stack').scroll_into_view_if_needed()
    assert page.locator('.workshop-node').first.evaluate('(e)=>getComputedStyle(e).opacity')=='1'
    assert page.locator('.workshop-orbit').evaluate('(e)=>getComputedStyle(e).animationName')=='none'
    page.get_by_role('tab',name=__import__("re").compile("Exploring")).click()
    assert page.locator('.workshop-detail-name').inner_text()=='AI'
    results.append({'reduced_motion':'pass'})
    print(json.dumps(results,indent=2))
    browser.close()
