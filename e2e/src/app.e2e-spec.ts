import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display saying Ristorante Con Fusion', () => {
    page.navigateTo('/');
    expect(page.getParagraphText('app-root h1')).toEqual('Welcome to conFusion!');
  });

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });

  it('should navigate to about us page by clicking on the link', () => {
    page.navigateTo('/');
    let navLink = page.getAllElements('a').get(1);
    navLink.click();

    expect(page.getParagraphText('h3')).toBe('About Us');
  });

  it('should enter a new comment for the first dish', () => {
    page.navigateTo('/dishdetail/0');
    let newAuthor = page.getElement('input[type=text]');
    newAuthor.sendKeys('Test Author');
    const newComment = page.getElement('textarea');
    newComment.sendKeys('Test Comment');

    let newSubmitButton = page.getElement('button[type=submit]');
    newSubmitButton.click();
    browser.pause();
  });
});
