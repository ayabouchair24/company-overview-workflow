import { z } from 'zod';
import {
  BubbleFlow,
  AIAgentBubble,
  WebScrapeTool,
  WebSearchTool,
  LinkedInTool,
  ResendBubble,
  type WebhookEvent,
} from '@bubblelab/bubble-core';

export interface CompanyResearchPayload extends WebhookEvent {
  /**
   * The name of the company you want to research (e.g., "Google", "Stripe", "Notion").
   * @canBeFile false
   */
  companyName: string;

  /**
   * The company's LinkedIn username (the part after linkedin.com/company/). 
   * Find it by visiting the company's LinkedIn page and copying the last part of the URL.
   * Example: for "linkedin.com/company/google" enter "google".
   * @canBeFile false
   */
  linkedinUsername?: string;

  /**
   * Email address where the final Company Snapshot Report will be sent.
   * @canBeFile false
   */
  recipientEmail: string;
}

export interface CompanyDetails {
  companyName: string;
  linkedinPageUrl?: string;
  linkedinUsername?: string;
}

export interface WebsiteInfo {
  homepageUrl: string;
  aboutPageUrl?: string;
  newsPageUrl?: string;
}

export interface ScrapedContent {
  homepage?: string;
  about?: string;
  news?: string;
}

export class CompanySnapshotFlow extends BubbleFlow<'webhook/http'> {
  async handle(payload: CompanyResearchPayload): Promise<{ message: string }> {
    const {
      companyName = 'Stripe',
      linkedinUsername,
      recipientEmail = 'user@example.com',
    } = payload;

    // Find the company's official website
    const websiteInfo = await this.findCompanyWebsite(companyName);

    // Scrape the company's website (Homepage, About, News)
    const websiteContent = await this.scrapeWebsite(websiteInfo);

    // Scrape the company's LinkedIn posts from the last 3 weeks
    const linkedinPosts = await this.scrapeLinkedInPosts(linkedinUsername || companyName.toLowerCase().replace(/\s+/g, ''));

    // Generate the final Company Snapshot Report using AI
    const report = await this.generateReport(companyName, websiteContent, linkedinPosts);

    // Send the report via email
    await this.sendReportEmail(recipientEmail, companyName, report);

    return { message: `Company Snapshot Report for ${companyName} has been sent to ${recipientEmail}.` };
  }

  // Searches for the company's official website and identifies About and News pages
  private async findCompanyWebsite(companyName: string): Promise<WebsiteInfo> {
    // Performs a web search to find the official website and key pages for the company
    const searchResult = await new WebSearchTool({
      query: `${companyName} official website about news blog`,
      limit: 5,
    }).action();

    // Uses AI to identify the most likely homepage, about page, and news page from search results
    const identificationAgent = new AIAgentBubble({
      message: `From these search results for "${companyName}", identify the official homepage URL, the "About Us" page URL, and the "News" or "Blog" page URL: ${JSON.stringify(searchResult.data?.results)}`,
      model: { model: 'google/gemini-3-flash-preview' },
      expectedOutputSchema: z.object({
        homepageUrl: z.string(),
        aboutPageUrl: z.string().optional(),
        newsPageUrl: z.string().optional(),
      }),
    });

    const result = await identificationAgent.action();
    if (!result.success || !result.data?.response) {
      throw new Error('Failed to identify company website URLs.');
    }

    return JSON.parse(result.data.response);
  }

  // Scrapes the identified website pages to gather mission, values, and news
  private async scrapeWebsite(info: WebsiteInfo): Promise<ScrapedContent> {
    const content: ScrapedContent = {};

    // Scrapes the homepage to get a general overview of the company
    const homeScrape = await new WebScrapeTool({ url: info.homepageUrl }).action();
    content.homepage = homeScrape.data?.content;

    // Scrapes the About page if found to extract mission and values
    if (info.aboutPageUrl) {
      const aboutScrape = await new WebScrapeTool({ url: info.aboutPageUrl }).action();
      content.about = aboutScrape.data?.content;
    }

    // Scrapes the News or Blog page if found to get recent updates
    if (info.newsPageUrl) {
      const newsScrape = await new WebScrapeTool({ url: info.newsPageUrl }).action();
      content.news = newsScrape.data?.content;
    }

    return content;
  }

  // Fetches recent LinkedIn posts from the company's profile
  private async scrapeLinkedInPosts(username?: string): Promise<string> {
    if (!username) return 'No LinkedIn username found for scraping posts.';

    // Scrapes the most recent posts from the company's LinkedIn profile to understand their current activity
    const result = await new LinkedInTool({
      operation: 'scrapePosts',
      username: username,
      limit: 10,
    }).action();

    if (!result.success || !result.data?.posts) return 'Failed to fetch LinkedIn posts.';

    // Formats the posts into a readable string for the AI summarizer
    return result.data.posts
      .map(p => `[${p.postedAt?.date || 'Unknown Date'}] ${p.text}`)
      .join('\n\n');
  }

  // Summarizes all gathered information into a concise report
  private async generateReport(companyName: string, website: ScrapedContent, posts: string): Promise<string> {
    // Uses AI to synthesize website content and LinkedIn activity into a structured "Company Snapshot Report"
    const reportAgent = new AIAgentBubble({
      message: `Generate a concise "Company Snapshot Report" for ${companyName}.
      
      Website Content:
      Homepage: ${website.homepage || 'N/A'}
      About Page: ${website.about || 'N/A'}
      News Page: ${website.news || 'N/A'}
      
      Recent LinkedIn Posts (last 3 weeks):
      ${posts}
      
      The report should include:
      1. Company Mission, Values, and Culture
      2. Key points from recent LinkedIn posts
      3. Highlights from website news or blogs
      
      Format the output in clean Markdown.`,
      model: { model: 'google/gemini-3-flash-preview' },
    });

    const result = await reportAgent.action();
    return result.data?.response || 'Failed to generate report content.';
  }

  // Sends the generated report to the user's email
  private async sendReportEmail(email: string, companyName: string, report: string): Promise<void> {
    // Sends the final Markdown report as an email using Resend
    await new ResendBubble({
      operation: 'send_email',
      to: [email],
      subject: `Company Snapshot Report: ${companyName}`,
      text: report,
    }).action();
  }
}
