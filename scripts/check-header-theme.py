from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    results=[]
    for width,height in [(1440,900),(390,844)]:
        context=browser.new_context(viewport={'width':width,'height':height},color_scheme='light')
        page=context.new_page()
        errors=[]
        page.on('pageerror',lambda error: errors.append(str(error)))
        page.goto('http://localhost:3000',wait_until='networkidle')
        page.wait_for_timeout(1300)
        assert page.locator('#primary-nav .nav-link').evaluate_all('(links)=>links.map(e=>e.getAttribute("href"))')==['#intro','#project-journal','#about','#stack','#contact']
        assert page.locator('#primary-nav .nav-link>svg').count()==5
        assert page.locator('#work').count()==0
        assert page.locator('#lab').count()==0
        assert page.locator('html').get_attribute('data-theme')=='light'
        assert page.locator('a[href="#work"]').count()==0
        for id in ['intro','project-journal','about','stack','contact']:
            page.evaluate('id=>{const e=document.getElementById(id);window.scrollTo({top:window.scrollY+e.getBoundingClientRect().top-document.querySelector("header").offsetHeight+5,behavior:"instant"});}',id)
            page.wait_for_timeout(450)
            current=page.locator('#primary-nav [aria-current=location]').get_attribute('href')
            assert current=='#'+id,(id,current)
        page.get_by_role('switch',name='Dark theme').click()
        page.wait_for_timeout(1000)
        assert page.locator('html').get_attribute('data-theme')=='dark'
        assert page.get_by_role('switch',name='Dark theme').get_attribute('aria-checked')=='true'
        assert page.evaluate('localStorage.getItem("bless-theme")')=='dark'
        page.reload(wait_until='networkidle')
        assert page.locator('html').get_attribute('data-theme')=='dark'
        # Check real dark surfaces and readable ink; don't invert project previews.
        palette=page.evaluate('''()=>({body:getComputedStyle(document.body).backgroundColor,ink:getComputedStyle(document.body).color,page:getComputedStyle(document.querySelector('.journal-page')).backgroundColor,about:getComputedStyle(document.querySelector('#about')).backgroundColor,tool:getComputedStyle(document.querySelector('.workshop-core')).backgroundColor})''')
        assert palette['ink']!='rgb(21, 23, 29)',palette
        if width<1100:
            assert not page.locator('#primary-nav').is_visible()
            page.get_by_role('button',name='Open menu').click()
            page.wait_for_timeout(700)
            assert page.locator('#primary-nav').is_visible()
            page.get_by_role('link',name='Stack 04',exact=True).click()
            page.wait_for_timeout(1800)
            assert page.get_by_role('button',name='Open menu').get_attribute('aria-expanded')=='false'
            assert page.locator('#primary-nav [aria-current=location]').get_attribute('href')=='#stack'
            page.get_by_role('button',name='Open menu').click()
            page.keyboard.press('Escape')
            assert page.get_by_role('button',name='Open menu').evaluate('(e)=>e===document.activeElement')
        else:
            page.get_by_role('link',name='About',exact=True).click()
            page.wait_for_timeout(1700)
            assert page.locator('#primary-nav [aria-current=location]').get_attribute('href')=='#about'
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
        assert not errors,errors
        results.append({'viewport':[width,height],'navigation':'pass','theme':'pass','palette':palette})
        context.close()
    context=browser.new_context(viewport={'width':390,'height':844},color_scheme='dark',reduced_motion='reduce')
    page=context.new_page()
    page.goto('http://localhost:3000',wait_until='networkidle')
    assert page.locator('html').get_attribute('data-theme')=='dark'
    page.get_by_role('switch',name='Dark theme').click()
    page.wait_for_timeout(150)
    assert page.locator('html').get_attribute('data-theme')=='light'
    assert not page.locator('html').evaluate('(e)=>e.classList.contains("theme-view-transition")')
    results.append({'system_preference_and_reduced_motion':'pass'})
    print(json.dumps(results,indent=2))
    browser.close()
