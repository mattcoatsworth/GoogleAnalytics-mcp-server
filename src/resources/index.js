import { propertyResource } from './propertyResource.js';
    import { reportResource } from './reportResource.js';
    import { metadataResource } from './metadataResource.js';
    import { dimensionsResource } from './dimensionsResource.js';
    import { metricsResource } from './metricsResource.js';
    import { audiencesResource } from './audiencesResource.js';

    export const analyticsResources = {
      property: propertyResource,
      report: reportResource,
      metadata: metadataResource,
      dimensions: dimensionsResource,
      metrics: metricsResource,
      audiences: audiencesResource
    };
