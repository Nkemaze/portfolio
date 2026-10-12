from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    results = []
    for width, height in [(1440, 900), (390, 844), (1280, 720), (375, 667)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto('http://localhost:3000', wait_until='networkidle')
        page.wait_for_timeout(1500)
        assert page.locator('.hero-line-mask').count() == 2
        geometry = page.evaluate('''() => {
          const section = document.querySelector('.project-journal');
          const header = document.querySelector('.site-header').offsetHeight;
          return { top: window.scrollY + section.getBoundingClientRect().top, height: section.offsetHeight, header, travel: section.offsetHeight - (innerHeight - header) };
        }''')
        def chapter(number, fraction=0):
            page.evaluate('([y]) => window.scrollTo({top:y, behavior:"instant"})', [geometry['top']-geometry['header'] + (number+fraction)/5*geometry['travel']])
            page.wait_for_timeout(250)
        chapter(1)
        assert 'Contents' in page.locator('.journal-live').inner_text()
        metrics = page.evaluate('''()=>{const pg=document.querySelector('.journal-static-left .journal-page'); const list=pg.querySelector('.journal-contents-list'); const bottom=pg.querySelector('.journal-page-bottom'); return {listBottom:list.getBoundingClientRect().bottom,footerTop:bottom.getBoundingClientRect().top, horizontalOverflow: document.documentElement.scrollWidth>innerWidth};}''')
        print("page-fit", width, height, metrics)
        if metrics['listBottom'] > metrics['footerTop']:
            page.screenshot(path=f'/home/ubuntu/folio/bless-portfolio/book-fit-{width}.png')
        assert metrics['listBottom'] <= metrics['footerTop']+2, metrics
        chapter(2, .5)
        assert page.locator('.journal-leaf').count() == 1
        transform = page.locator('.journal-leaf').evaluate('(e)=>getComputedStyle(e).transform')
        assert transform != 'none'
        chapter(2)
        assert 'PharmaFinder' in page.locator('.journal-live').inner_text()
        page.get_by_role('button', name='Next journal page', exact=True).click()
        page.wait_for_timeout(1300)
        assert 'DEVBUG' in page.locator('.journal-live').inner_text()
        page.keyboard.press('ArrowLeft')
        page.wait_for_timeout(1300)
        assert 'PharmaFinder' in page.locator('.journal-live').inner_text()
        page.get_by_role('button', name='Continue to about', exact=True).click()
        page.wait_for_timeout(1300)
        assert page.locator('.about-section').evaluate('(e)=>e.getBoundingClientRect().top') < height
        assert not errors, errors
        results.append({'viewport': [width,height], 'result': 'pass', **metrics})
        page.close()
    page=browser.new_page(viewport={'width':390,'height':844}, reduced_motion='reduce')
    page.goto('http://localhost:3000', wait_until='networkidle')
    assert page.locator('.hero-char').first.evaluate('(e)=>getComputedStyle(e).transform')=='none'
    assert page.locator('.project-journal').evaluate('(e)=>e.classList.contains("journal-reduced")')
    page.get_by_role('button', name='Journal: PharmaFinder', exact=True).click()
    assert 'PharmaFinder' in page.locator('.journal-live').inner_text()
    assert page.locator('.journal-leaf').count()==0
    results.append({'reduced_motion':'pass'})
    print(json.dumps(results, indent=2))
    browser.close()
