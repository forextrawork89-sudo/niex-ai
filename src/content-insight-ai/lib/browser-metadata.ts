export function extractPageMetadata(win: Window | Document): Record<string, unknown> {
  try {
    const doc = (win as any).document || (win as Document);
    const title = doc.title || '';
    const url = (doc.location && doc.location.href) ? doc.location.href : '';
    const metaTags: Record<string, string> = {};
    const metaList = doc.getElementsByTagName ? (doc.getElementsByTagName('meta') as unknown as HTMLCollectionOf<HTMLMetaElement>) : [];
    for (const m of Array.from(metaList || [])) {
      const name = m.getAttribute('name') || m.getAttribute('property') || m.getAttribute('itemprop');
      if (name) metaTags[name] = m.getAttribute('content') || '';
    }

    // Alt texts
    const alt_texts = Array.from(doc.querySelectorAll('img[alt]')).map((i: any) => i.getAttribute('alt') || '').filter(Boolean);
    const aria_labels = Array.from(doc.querySelectorAll('[aria-label]')).map((n: any) => n.getAttribute('aria-label') || '').filter(Boolean);
    const innerText = doc.body ? (doc.body.innerText || '') : '';

    // Captions and transcripts (common selectors)
    const captions = Array.from(doc.querySelectorAll('caption, .caption, .video-caption')).map((n: any) => n.textContent || '').filter(Boolean);
    const transcripts = Array.from(doc.querySelectorAll('transcript, .transcript, [data-transcript]')).map((n: any) => n.textContent || '').filter(Boolean);

    return {
      page_title: title,
      url,
      meta: metaTags,
      alt_texts,
      aria_labels,
      innerText: innerText.slice(0, 20000),
      captions,
      transcripts,
    };
  } catch (e) {
    return {};
  }
}
