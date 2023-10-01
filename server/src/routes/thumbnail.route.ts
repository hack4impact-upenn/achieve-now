import { RequestHandler, Router } from 'express';
import axios from 'axios';
import DomParser from 'dom-parser';
import { isAuthenticated } from '../controllers/auth.middleware';

const thumbnailRouter = Router();

/**
 * @param id the youtube video id
 * @returns the youtube video thumbnail url
 */
const getYoutubeThumbnailUrl = (id: string) => {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};

/**
 * @param url the url of the page to scrape
 * @returns the thumbnail url of the page, or an empty string if none is found
 */
const getPageThumbnailUrl = async (url: string) => {
  const response = await axios.get(url);
  const html = response.data;
  const parser = new DomParser();
  const doc = parser.parseFromString(html);
  const metaElements = doc.getElementsByTagName('meta');
  let thumbnailUrl = '';
  metaElements?.forEach((e: any) => {
    const property = e.getAttribute('property');
    if (property === 'og:image') {
      const content = e.getAttribute('content');
      thumbnailUrl = content || '';
    }
  });
  return thumbnailUrl;
};

/**
 * HTTP handler for retrieving a thumbnail from a url
 */
const retrieveThumbnail: RequestHandler = async (req, res) => {
  const { url } = req.body;

  // Ensure they gave a valid url
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'URL is required' });
  }

  // Normal youtube URL
  if (url?.includes('www.youtube.com/watch')) {
    const videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    const id =
      ampersandPosition !== -1
        ? videoId.substring(0, ampersandPosition)
        : videoId;

    return res.status(200).json({ url: getYoutubeThumbnailUrl(id) });
  }

  // Shortened youtube URL
  if (url?.includes('youtu.be')) {
    const videoId = url.split('youtu.be/')[1];
    const questionMarkPosition = videoId.indexOf('?');
    const id =
      questionMarkPosition !== -1
        ? videoId.substring(0, questionMarkPosition)
        : videoId;

    return res.status(200).json({ url: getYoutubeThumbnailUrl(id) });
  }

  // We try and scrape the thumbnail url from the page
  const thumbnailUrl = await getPageThumbnailUrl(url);
  if (thumbnailUrl) {
    return res.status(200).json({ url: thumbnailUrl });
  }

  // Fallthrough
  // In this case, we just return the Achieve Now logo
  return res.status(200).json({
    url: 'https://images.squarespace-cdn.com/content/v1/611bfe8c78c5c96a4c0d6314/eca03de9-70b2-4577-8871-5dd3633ef125/achieve+now+logo+FINAL+RGB-no+tagline.png?format=1500w',
  });
};

thumbnailRouter.post('/', isAuthenticated, retrieveThumbnail);

export default thumbnailRouter;
