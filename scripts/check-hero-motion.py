from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width, height in [(1440, 900), (390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto('http://localhost:3000', wait_until='networkidle')
        page.wait_for_timeout(2400)
        assert page.get_by_role('button', name='Replay hero animation').count() == 0
        assert page.get_by_role('heading', name='I BUILD DIGITAL THINGS THAT MATTER.', exact=True).is_visible()
        assert page.locator('.hero-char').first.evaluate('(e)=>getComputedStyle(e).color') == 'rgb(21, 23, 29)'
        assert page.locator('.hero-emphasis .hero-char').first.evaluate('(e)=>getComputedStyle(e).color') == 'rgb(49, 92, 255)'
        assert page.locator('.code-window').evaluate('(e)=>getComputedStyle(e).transform').startswith('matrix3d')
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
        page.evaluate('window.originalHeroHeadline=document.querySelector(".hero h1")')
        for visit in range(2):
            page.locator('#stack').scroll_into_view_if_needed()
            page.wait_for_timeout(350)
            assert page.locator('.hero').evaluate('(e)=>e.classList.contains("is-offscreen")')
            page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
            page.wait_for_timeout(120)
            elapsed = page.locator('.code-float').evaluate('(e)=>e.getAnimations().find(a=>a.animationName==="hero-code-assemble").currentTime')
            assert elapsed < 400, elapsed
            assert page.evaluate('window.originalHeroHeadline===document.querySelector(".hero h1")')
            page.wait_for_timeout(2400)
            assert page.locator('.hero-char').first.evaluate('(e)=>getComputedStyle(e).opacity') == '1'
            # Normal movement inside the section does not restart the animation.
            page.evaluate('window.scrollTo({top:20,behavior:"instant"})')
            page.wait_for_timeout(150)
            elapsed = page.locator('.code-float').evaluate('(e)=>e.getAnimations().find(a=>a.animationName==="hero-code-assemble").currentTime')
            assert elapsed >= 1700, elapsed
        assert not errors, errors
        print('PASS automatic hero replay:', width, height, 'two re-entries, no button, no remount, no in-section retrigger')
        page.close()
    page = browser.new_page(viewport={'width':390,'height':844}, reduced_motion='reduce')
    page.goto('http://localhost:3000', wait_until='networkidle')
    page.locator('#stack').scroll_into_view_if_needed()
    page.wait_for_timeout(250)
    page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
    page.wait_for_timeout(250)
    assert page.locator('.hero-char').first.evaluate('(e)=>getComputedStyle(e).opacity') == '1'
    assert page.locator('.code-float').evaluate('(e)=>getComputedStyle(e).animationName') == 'none'
    print('PASS reduced motion unchanged')
    browser.close()
