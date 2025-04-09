import { runReport } from './runReport.js';
    import { batchRunReports } from './batchRunReports.js';
    import { runPivotReport } from './runPivotReport.js';
    import { batchRunPivotReports } from './batchRunPivotReports.js';
    import { getMetadata } from './getMetadata.js';
    import { checkCompatibility } from './checkCompatibility.js';
    import { createAudience } from './createAudience.js';
    import { listAudiences } from './listAudiences.js';
    import { getAudience } from './getAudience.js';
    import { deleteAudience } from './deleteAudience.js';
    import { updateAudience } from './updateAudience.js';

    export const analyticsTools = {
      runReport,
      batchRunReports,
      runPivotReport,
      batchRunPivotReports,
      getMetadata,
      checkCompatibility,
      createAudience,
      listAudiences,
      getAudience,
      deleteAudience,
      updateAudience
    };
