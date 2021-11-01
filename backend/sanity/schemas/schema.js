// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';

// We import document schemas
import author from './documents/author';
import course from './documents/course';
import framework from './documents/framework';
import language from './documents/language';
import lesson from './documents/lesson';
import page from './documents/page';
import podcast from './documents/podcast';
import post from './documents/post';
import site from './documents/site';
import tutorial from './documents/tutorial';

// We import object schemas
import mainImage from './objects/mainImage';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    author,
    course,
    lesson,
    mainImage,
    page,
    podcast,
    post,
    site,
    tutorial,
    framework,
    language,
  ]),
});
