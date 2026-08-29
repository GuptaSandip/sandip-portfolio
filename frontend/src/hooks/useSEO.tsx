import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  author?: string
}

export function useSEO({
  title = "Sandip Gupta - Full Stack Developer",
  description = "Portfolio of Sandip Gupta. Full stack developer building scalable web applications with React, Python, and cloud technologies.",
  image = "https://sandip.dev/og-image.png",
  url = "https://sandip.dev",
  type = "website",
  author = "Sandip Gupta"
}: SEOProps = {}) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Sandip Gupta" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Additional Useful Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en-US" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
    </Helmet>
  )
}

export function useStructuredData(data: Record<string, any>) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  )
}
