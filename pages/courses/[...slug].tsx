import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { getAllContentPaths, getContentData, getNavigationHierarchy, NavItem } from '../../lib/contentService';
import CourseLayout from '../../components/layouts/CourseLayout';
import MarkdownRenderer from '../../components/content/MarkdownRenderer';

interface CoursePageProps {
  content: {
    id: string;
    htmlContent: string;
    title?: string;
    description?: string;
    [key: string]: any; // for other frontmatter fields
  };
  navigationHierarchy: NavItem[];
  currentSlug: string[];
}

interface Params extends ParsedUrlQuery {
  slug: string[];
}

const CoursePage: NextPage<CoursePageProps> = ({ content, navigationHierarchy, currentSlug }) => {
  if (!content) {
    console.error("CoursePage rendered with no content for slug:", currentSlug);
    return <div>Error: Content not found.</div>;
  }

  return (
    <CourseLayout navigationHierarchy={navigationHierarchy} currentSlug={currentSlug}>
      <Head>
        <title>{content.title || 'Course Page'}</title>
        {content.description && <meta name="description" content={content.description} />}
      </Head>
      <article>
        {content.title && <h1>{content.title}</h1>}
        <MarkdownRenderer htmlContent={content.htmlContent} />
      </article>
      {/* Placeholder for other components like ExerciseLinkButton, CommentSection etc. */}
    </CourseLayout>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  console.log("Attempting to get all content paths...");
  const paths = getAllContentPaths();
  console.log("Generated paths for getStaticPaths:", JSON.stringify(paths, null, 2));
  if (paths.length === 0) {
    console.warn("getStaticPaths generated an empty list of paths. Check content directory and contentService.ts logic.");
  }
  return {
    paths,
    fallback: false, // Can be true or 'blocking' if you have many pages and want ISR
  };
};

export const getStaticProps: GetStaticProps<CoursePageProps, Params> = async (context) => {
  const { slug } = context.params!;
  const slugArray = Array.isArray(slug) ? slug : (slug ? [slug] : []);

  console.log(`[...slug].tsx getStaticProps: Received slugArray: ${JSON.stringify(slugArray)}`);

  if (!slugArray || slugArray.length === 0) {
    console.error("[...slug].tsx getStaticProps: Received empty or invalid slugArray.");
    return { notFound: true };
  }

  try {
    const contentData = await getContentData(slugArray);
    const navigationHierarchy = getNavigationHierarchy();

    return {
      props: {
        content: contentData,
        navigationHierarchy,
        currentSlug: slugArray,
      },
    };
  } catch (error: any) {
    console.error(`[...slug].tsx getStaticProps: Error for slug "${slugArray.join('/')}":`, error.message, error.stack);
    return {
      notFound: true, // Or redirect to a custom error page
    };
  }
};

export default CoursePage;
