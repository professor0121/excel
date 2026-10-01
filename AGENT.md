# MASTER DEVELOPMENT PROMPT

# GEMINI DATALAB FOR EXCEL

## Complete AI-Powered Data Science, Analytics & Machine Learning Platform

---

# 1. ROLE AND RESPONSIBILITY

Act as a Senior Software Architect, Full-Stack TypeScript Engineer, Data Scientist, Machine Learning Engineer, Excel Add-in Developer, AI Engineer, UI/UX Designer, Security Engineer and QA Engineer.

Your responsibility is to design and develop a production-oriented software product called:

**Gemini DataLab for Excel**

This product is an AI-powered Data Science and Analytics Studio integrated with Microsoft Excel.

The product must allow users to perform complete data science workflows without requiring Python.

Use JavaScript and TypeScript for the frontend, backend, data processing, statistical computation, machine learning and visualization.

Google Gemini will provide natural-language understanding, explanations, analysis planning and AI assistance. Actual mathematical and statistical calculations must be performed by deterministic computation engines.

Do not pretend that Gemini-generated numerical answers are verified computations.

The application should be modular, scalable, secure, maintainable, testable and suitable for eventual commercial SaaS distribution.

---

# 2. PRODUCT VISION

Build a platform that combines:

1. AI Excel Assistant
2. Data Import and Integration Studio
3. Data Profiling Studio
4. Data Cleaning Studio
5. Data Transformation Studio
6. Exploratory Data Analysis (EDA)
7. Statistical Analysis Studio
8. Hypothesis Testing Studio
9. Data Visualization Studio
10. Business Intelligence Dashboard
11. Machine Learning Studio
12. Deep Learning Studio
13. Time Series Analysis Studio
14. Anomaly Detection Studio
15. AI Data Scientist
16. Automated Data Pipeline Builder
17. AI Report Generator
18. Excel Formula Assistant
19. Excel Automation Engine
20. Project and Dataset Management
21. User Authentication and Authorization
22. SaaS Subscription and Usage Management
23. Administration Dashboard
24. Monitoring, Logging and Audit System

The product must support both:

* Native Microsoft Excel Add-in.
* Standalone web application.

The Excel Add-in should be able to read workbook data, analyze it and write approved results back to Excel.

The standalone application should allow users to upload and analyze CSV, Excel and other supported datasets.

---

# 3. STRICT TECHNOLOGY REQUIREMENTS

## Frontend

* React
* TypeScript
* Vite for the standalone web application.
* Office.js for Excel integration.
* Redux Toolkit for global state management.
* Redux Toolkit Query or Axios for API communication.
* React Router for standalone application routing.
* Fluent UI or Tailwind CSS.
* Apache ECharts for visualization.
* React Hook Form.
* Zod.
* TanStack Table.
* Monaco Editor for formula and query editing where appropriate.

## Backend

* Node.js
* TypeScript
* Express.js
* MongoDB
* Mongoose
* Redis
* BullMQ
* Socket.IO where real-time updates are required.
* Zod validation.
* Pino logging.
* JWT authentication with secure refresh-token handling.

Use ES modules.

## AI

* Official Google GenAI JavaScript SDK: @google/genai
* Gemini API.
* Structured JSON responses.
* Function/tool calling.
* AI prompt templates.
* AI response validation.
* Provider abstraction for future AI providers.

Never expose AI API keys in the frontend.

## Data Processing

Use appropriate JavaScript/TypeScript libraries:

* DuckDB / DuckDB-Wasm
* Arquero
* Apache Arrow
* Danfo.js where useful.
* SheetJS for spreadsheet ingestion.
* ExcelJS for supported workbook generation.
* Papa Parse for CSV.
* math.js for mathematical expressions.
* ml-matrix for matrix operations.

## Statistical Computing

* simple-statistics
* jStat
* ml-matrix
* math.js
* Additional JavaScript or WebAssembly libraries when scientifically appropriate.

## Machine Learning

* ML.js ecosystem.
* TensorFlow.js.
* ONNX Runtime where suitable.
* DuckDB for analytical feature preparation.
* Appropriate JavaScript optimization and numerical libraries.

## Infrastructure

* Docker
* Docker Compose
* GitHub Actions
* MongoDB
* Redis
* BullMQ
* Object storage abstraction.
* Environment-based configuration.

## Important restrictions

1. Do not require Python.
2. Do not create a Python backend or Python microservice.
3. Do not execute arbitrary AI-generated JavaScript.
4. Do not execute arbitrary SQL without validation and authorization.
5. Do not perform large computations directly inside Express request handlers.
6. Use workers, queues, streaming and memory-aware processing.
7. Do not fabricate statistical or machine learning results.
8. Do not silently modify the user's workbook.
9. Do not use fake data in production functionality.
10. Use actual supported package APIs and verify library compatibility before implementation.

If a particular scientific algorithm is not reliably supported by the selected JavaScript library, identify the limitation and implement or integrate a validated alternative in JavaScript, TypeScript or WebAssembly. Never silently substitute an approximate result for an exact statistical method.

---

# 4. HIGH-LEVEL ARCHITECTURE

Build a modular monorepo.

Suggested architecture:

gemini-datalab/
â”‚
â”œâ”€â”€ apps/
â”‚   â”œâ”€â”€ web/
â”‚   â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â””â”€â”€ package.json
â”‚   â”‚
â”‚   â”œâ”€â”€ excel-addin/
â”‚   â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ manifest.xml
â”‚   â”‚   â””â”€â”€ package.json
â”‚   â”‚
â”‚   â””â”€â”€ api/
â”‚       â”œâ”€â”€ src/
â”‚       â”‚   â”œâ”€â”€ config/
â”‚       â”‚   â”œâ”€â”€ modules/
â”‚       â”‚   â”œâ”€â”€ middlewares/
â”‚       â”‚   â”œâ”€â”€ routes/
â”‚       â”‚   â”œâ”€â”€ workers/
â”‚       â”‚   â”œâ”€â”€ queues/
â”‚       â”‚   â”œâ”€â”€ utils/
â”‚       â”‚   â””â”€â”€ server.ts
â”‚       â””â”€â”€ package.json
â”‚
â”œâ”€â”€ packages/
â”‚   â”œâ”€â”€ shared-types/
â”‚   â”œâ”€â”€ validation/
â”‚   â”œâ”€â”€ data-engine/
â”‚   â”œâ”€â”€ ingestion-engine/
â”‚   â”œâ”€â”€ cleaning-engine/
â”‚   â”œâ”€â”€ transformation-engine/
â”‚   â”œâ”€â”€ statistics-engine/
â”‚   â”œâ”€â”€ visualization-engine/
â”‚   â”œâ”€â”€ machine-learning-engine/
â”‚   â”œâ”€â”€ time-series-engine/
â”‚   â”œâ”€â”€ anomaly-engine/
â”‚   â”œâ”€â”€ ai-engine/
â”‚   â”œâ”€â”€ excel-engine/
â”‚   â”œâ”€â”€ pipeline-engine/
â”‚   â””â”€â”€ report-engine/
â”‚
â”œâ”€â”€ infrastructure/
â”‚   â”œâ”€â”€ docker/
â”‚   â”œâ”€â”€ mongodb/
â”‚   â””â”€â”€ redis/
â”‚
â”œâ”€â”€ docs/
â”‚   â”œâ”€â”€ architecture/
â”‚   â”œâ”€â”€ api/
â”‚   â”œâ”€â”€ modules/
â”‚   â””â”€â”€ decisions/
â”‚
â”œâ”€â”€ scripts/
â”œâ”€â”€ tests/
â”œâ”€â”€ docker-compose.yml
â”œâ”€â”€ .env.example
â”œâ”€â”€ package.json
â”œâ”€â”€ pnpm-workspace.yaml
â””â”€â”€ README.md

You may adjust the structure when justified, but preserve modular boundaries.

Each module should follow a consistent pattern where appropriate:

* routes
* controllers
* services
* repositories
* validators
* types
* utils
* tests

Avoid unnecessary abstraction. Use interfaces for important engine and provider boundaries.

---

# 5. COMPLETE FEATURE DEVELOPMENT PLAN

Implement the following phases in order.

Each phase is a separate development milestone.

Do not skip phases without explaining the dependency and obtaining approval.

## PHASE 1 â€” Project Foundation

Build the foundation.

Features:

* Initialize monorepo.
* Configure pnpm workspaces.
* Configure TypeScript.
* Configure ESLint and Prettier.
* Configure shared TypeScript types.
* Configure environment validation.
* Create React web application.
* Create Excel Add-in application.
* Create Express API.
* Connect MongoDB.
* Configure Redis.
* Configure Docker Compose.
* Configure logging.
* Configure error handling.
* Configure health-check endpoints.
* Create GitHub Actions CI.
* Add initial automated tests.

Deliverables:

* Working frontend.
* Working backend.
* Working Excel Add-in development environment.
* Database connection.
* Redis connection.
* Docker development environment.
* Project documentation.

## PHASE 2 â€” Excel Integration Engine

Develop native Excel integration.

Features:

* Office Add-in manifest.
* Excel task pane.
* Workbook detection.
* Worksheet detection.
* Active worksheet information.
* Selected range detection.
* Read selected cell values.
* Read formulas.
* Read formatting metadata when supported.
* Detect table ranges.
* Read Excel tables.
* Read column headers.
* Read named ranges.
* Read multiple worksheets.
* Write values to selected ranges.
* Create new worksheets.
* Create Excel tables.
* Insert formulas.
* Create native Excel charts.
* Apply supported formatting.
* Export analysis results.
* Workbook context management.

Safety:

* Require confirmation for destructive actions.
* Preview write operations.
* Validate cell ranges.
* Handle workbook and worksheet errors.
* Avoid overwriting existing data without approval.

Create an Excel adapter interface so the core data engine does not depend directly on Office.js.

## PHASE 3 â€” Data Ingestion Studio

Support multiple data sources.

File formats:

* CSV
* TSV
* XLSX
* XLS
* JSON
* JSON Lines where supported.
* Parquet where supported.
* Apache Arrow.

Future integrations:

* PostgreSQL
* MySQL
* MongoDB
* REST APIs
* Cloud object storage.

Features:

* Drag-and-drop upload.
* File validation.
* File-size validation.
* File preview.
* Sheet selection.
* Header detection.
* Delimiter detection.
* Encoding detection.
* Schema inference.
* Data type inference.
* Large file processing.
* Streaming ingestion.
* Upload progress.
* Import history.
* Dataset registration.

Provide clear error messages for unsupported or malformed files.

## PHASE 4 â€” Dataset Explorer and Data Profiling

Build a complete dataset inspection workspace.

Features:

* Dataset overview.
* Total rows.
* Total columns.
* Memory estimates.
* Column names.
* Data types.
* Unique value counts.
* Null counts.
* Null percentages.
* Duplicate counts.
* Minimum and maximum.
* Mean and median.
* Standard deviation.
* Frequency distributions.
* Numeric summaries.
* Categorical summaries.
* Date summaries.
* Data quality score with transparent methodology.
* Column relationship suggestions.

Create an interactive dataset preview.

Support pagination, filtering and sorting.

Do not load an unlimited dataset into browser memory.

## PHASE 5 â€” Data Cleaning Studio

Build a complete data quality and cleaning workspace.

Features:

### Missing values

* Detect missing values.
* Remove rows with missing values.
* Remove columns with excessive missing values.
* Mean imputation.
* Median imputation.
* Mode imputation.
* Constant-value imputation.
* Forward fill.
* Backward fill.
* Interpolation where mathematically appropriate.

### Duplicate handling

* Identify duplicate rows.
* Identify duplicate columns where relevant.
* Find duplicates using selected columns.
* Remove duplicates.
* Keep first or last occurrence.
* Generate duplicate reports.

### Outlier handling

* IQR method.
* Z-score method.
* Modified Z-score.
* Winsorization.
* Clipping.
* Outlier removal.
* Outlier visualization.

### Text cleaning

* Trim whitespace.
* Change case.
* Remove unwanted characters.
* Replace values.
* Standardize categories.
* Normalize text.

### Date cleaning

* Parse dates.
* Standardize date formats.
* Detect invalid dates.
* Extract year, month, day and weekday.

### Numeric cleaning

* Convert data types.
* Handle invalid numeric values.
* Remove unwanted symbols.
* Validate ranges.

### Data quality

* Generate cleaning reports.
* Compare before and after.
* Preview affected rows.
* Support undo where feasible.
* Save cleaning operations as reusable steps.

Never automatically delete or overwrite data without explicit approval.

## PHASE 6 â€” Data Transformation Studio

Implement data transformation operations.

Features:

* Filtering.
* Sorting.
* Selecting columns.
* Renaming columns.
* Dropping columns.
* Adding calculated columns.
* Grouping.
* Aggregation.
* Pivot.
* Unpivot / melt.
* Joins.
* Concatenation.
* Conditional transformations.
* String transformations.
* Date transformations.
* Numeric transformations.
* Normalization.
* Standardization.
* One-hot encoding.
* Label encoding.
* Binning.
* Feature extraction.
* Derived variables.
* Data type conversion.

Support reusable transformation recipes.

Show the transformation history.

Allow users to preview and approve transformations.

## PHASE 7 â€” Exploratory Data Analysis (EDA)

Create a complete EDA engine.

### Univariate analysis

* Mean.
* Median.
* Mode.
* Variance.
* Standard deviation.
* Minimum.
* Maximum.
* Range.
* Quartiles.
* Percentiles.
* IQR.
* Skewness.
* Kurtosis.
* Frequency tables.
* Histograms.
* Density estimates where supported.

### Bivariate analysis

* Numeric versus numeric.
* Numeric versus categorical.
* Categorical versus categorical.
* Scatter plots.
* Grouped statistics.
* Cross-tabulations.
* Correlation.

### Multivariate analysis

* Correlation matrices.
* Pairwise relationships.
* Group comparisons.
* Feature relationships.
* Multicollinearity diagnostics.
* PCA visualization where supported.

Generate an EDA report with:

* Dataset summary.
* Important observations.
* Potential quality issues.
* Statistical findings.
* Visualizations.
* Suggested next steps.

All observations must be grounded in computed results.

## PHASE 8 â€” Statistical Analysis Studio

Build a scientifically responsible statistics module.

### Descriptive statistics

* Central tendency.
* Dispersion.
* Distribution.
* Quantiles.
* Frequency distributions.
* Robust statistics.

### Probability distributions

* Normal.
* Binomial.
* Poisson.
* Uniform.
* Exponential.
* Other supported distributions.

### Correlation

* Pearson.
* Spearman.
* Kendall where a validated implementation is available.

### Regression

* Simple linear regression.
* Multiple linear regression.
* Logistic regression.
* Regression diagnostics.
* Residual analysis.
* Confidence intervals.

### Statistical inference

* Standard errors.
* Confidence intervals.
* Standard hypothesis-testing workflows.

Clearly distinguish sample statistics from population parameters.

## PHASE 9 â€” Hypothesis Testing Studio

Implement validated statistical tests.

Include:

* One-sample t-test.
* Independent two-sample t-test.
* Paired t-test.
* Welch's t-test.
* Chi-square goodness-of-fit.
* Chi-square test of independence.
* One-way ANOVA.
* Mann-Whitney U.
* Wilcoxon signed-rank.
* Kruskal-Wallis.
* Shapiro-Wilk where a validated implementation is available.
* Kolmogorov-Smirnov where appropriate.
* Fisher's exact test where supported.

For each test provide:

* Null hypothesis.
* Alternative hypothesis.
* Test statistic.
* Degrees of freedom where applicable.
* P-value.
* Confidence interval where applicable.
* Effect size where applicable.
* Assumptions.
* Sample size.
* Interpretation.

Important:

* Never interpret p-value as the probability that the null hypothesis is true.
* Explain statistical significance separately from practical significance.
* Validate assumptions before suggesting a test.
* Do not invent test results when a method is unsupported.
* Account for multiple comparisons when relevant.

## PHASE 10 â€” Data Visualization Studio

Build an interactive visualization platform using Apache ECharts.

Support:

### Basic charts

* Bar chart.
* Line chart.
* Area chart.
* Pie chart.
* Donut chart.
* Stacked chart.

### Statistical charts

* Histogram.
* Box plot.
* Violin plot where supported.
* Scatter plot.
* Bubble chart.
* Density plot.
* Error bar chart.

### Advanced charts

* Heatmap.
* Correlation heatmap.
* Treemap.
* Waterfall.
* Funnel.
* Radar.
* Sankey.
* Calendar heatmap.
* Time series charts.

Features:

* Drag-and-drop field assignment.
* X-axis selection.
* Y-axis selection.
* Grouping.
* Aggregation.
* Filtering.
* Sorting.
* Color configuration.
* Tooltips.
* Legends.
* Zoom.
* Export as PNG and SVG where supported.
* Save visualization configurations.
* Insert supported charts into Excel.

Charts must reflect actual dataset values.

## PHASE 11 â€” Business Intelligence Dashboard

Create an interactive dashboard builder.

Features:

* Multiple charts.
* KPI cards.
* Tables.
* Filters.
* Date range selectors.
* Cross-filtering.
* Dashboard layout editor.
* Resizable widgets.
* Reusable dashboard templates.
* Dashboard saving.
* Dashboard sharing.
* Export to PDF.
* Export to image.
* Refresh data.

Support business dashboard templates such as:

* Sales analytics.
* Financial overview.
* Marketing analytics.
* Customer analytics.
* Inventory analytics.
* HR analytics.
* Student performance.
* Operations monitoring.

## PHASE 12 â€” Machine Learning Studio

Build a complete classical machine learning workflow.

### Supervised learning

Regression:

* Linear regression.
* Multiple regression.
* Polynomial regression where supported.
* Decision tree regression.
* Random forest regression where supported.
* Other validated regression models.

Classification:

* Logistic regression.
* Decision trees.
* Random forests.
* K-nearest neighbors.
* Naive Bayes.
* Support vector machines where supported.
* Gradient boosting where supported.

### Unsupervised learning

* K-means.
* Hierarchical clustering.
* DBSCAN where supported.
* PCA.
* Dimensionality reduction.

### Preprocessing

* Missing value handling.
* Encoding.
* Scaling.
* Feature selection.
* Train/test split.
* Stratified split.
* Cross-validation.

### Evaluation

Regression metrics:

* MAE.
* MSE.
* RMSE.
* R-squared.
* Adjusted R-squared where appropriate.

Classification metrics:

* Accuracy.
* Precision.
* Recall.
* F1-score.
* Confusion matrix.
* ROC-AUC.
* Precision-recall analysis.
* Log loss where supported.

Clustering metrics:

* Silhouette score.
* Inertia.
* Davies-Bouldin index where supported.

### ML workflow builder

1. Select dataset.
2. Select target variable.
3. Select features.
4. Choose task type.
5. Configure preprocessing.
6. Choose algorithm.
7. Configure hyperparameters.
8. Train model.
9. Evaluate.
10. Compare models.
11. Save model metadata.
12. Run predictions.
13. Export predictions to Excel.

Prevent data leakage.

All preprocessing that learns parameters from data must be fitted on training data only, then applied to validation/test data.

Use reproducible random seeds where supported.

## PHASE 13 â€” Deep Learning Studio

Use TensorFlow.js for supported neural network workloads.

Features:

* Tensor creation.
* Sequential models.
* Functional models where appropriate.
* Dense layers.
* Dropout.
* Batch normalization.
* Activation functions.
* Optimizers.
* Loss functions.
* Training.
* Validation.
* Model evaluation.
* Prediction.
* Model export.
* Training history.
* Loss curves.
* Accuracy curves.

Support suitable use cases:

* Basic regression.
* Classification.
* Tabular neural networks.
* Simple time series forecasting.
* Supported text and image workflows where feasible.

Clearly state hardware and model-size limitations.

Do not claim parity with specialized large-scale deep learning frameworks.

## PHASE 14 â€” Time Series Analysis Studio

Features:

* Date/time detection.
* Time index validation.
* Resampling.
* Rolling averages.
* Moving windows.
* Trend decomposition where supported.
* Seasonality analysis.
* Lag features.
* Autocorrelation.
* Partial autocorrelation where supported.
* Stationarity checks.
* Forecasting.
* Forecast evaluation.
* Prediction intervals where supported.

Support suitable forecasting methods:

* Naive forecasting.
* Moving average.
* Exponential smoothing.
* Linear trend models.
* Regression with lag features.
* Other validated JavaScript implementations.

Evaluation:

* MAE.
* RMSE.
* MAPE with zero-value safeguards.
* Backtesting.
* Walk-forward validation.

Never use random splitting for time-ordered forecasting tasks.

## PHASE 15 â€” Anomaly Detection Studio

Features:

* Z-score detection.
* Modified Z-score.
* IQR detection.
* Isolation Forest where supported.
* Local Outlier Factor where supported.
* Time series anomaly detection.
* Multivariate anomaly detection where supported.

Provide:

* Anomaly score.
* Anomaly label.
* Relevant features.
* Visualization.
* Review workflow.
* Export results to Excel.

Distinguish unusual observations from confirmed errors or fraud.

## PHASE 16 â€” Feature Engineering Studio

Features:

* Numerical feature generation.
* Categorical encoding.
* Date/time feature extraction.
* Text-derived features.
* Binning.
* Polynomial features.
* Interaction features.
* Scaling.
* Normalization.
* Feature selection.
* Variance filtering.
* Correlation filtering.
* Mutual information where supported.
* Feature importance.

Track feature transformations and their parameters.

## PHASE 17 â€” AI DATA SCIENTIST

Build the central Gemini-powered assistant.

Users should be able to ask questions in natural language.

Example requests:

* Analyze this dataset.
* Explain this correlation matrix.
* Find unusual sales patterns.
* Clean my dataset.
* Generate a customer segmentation analysis.
* Compare two products.
* Predict next month's sales.
* Create a sales dashboard.
* Explain the meaning of this statistical result.
* Generate a complete EDA report.
* Suggest an appropriate machine learning workflow.

The AI assistant should:

1. Understand user intent.
2. Understand workbook or dataset metadata.
3. Ask clarification questions when needed.
4. Generate a structured analysis plan.
5. Select suitable approved tools.
6. Execute deterministic computation tools.
7. Retrieve computed results.
8. Explain the findings.
9. Offer next actions.

Use an allowlisted tool registry.

Gemini must never directly execute arbitrary code.

All tool inputs and outputs must be validated with Zod.

Support:

* Conversation history.
* Dataset-aware chat.
* Workbook-aware chat.
* Context management.
* Conversation summaries.
* Token usage tracking.
* Error recovery.
* AI response citations to relevant dataset columns, rows or analysis outputs.

The AI must distinguish correlation from causation and must communicate uncertainty.

## PHASE 18 â€” NATURAL LANGUAGE TO DATA SCIENCE PIPELINE

Create an AI pipeline planner.

Example:

"Clean my customer dataset, remove duplicate customers, analyze age distribution, segment customers and create a dashboard."

The system should produce a structured workflow:

1. Inspect dataset.
2. Validate schema.
3. Detect missing values.
4. Detect duplicate customer records.
5. Apply approved cleaning.
6. Analyze age distribution.
7. Run customer segmentation.
8. Generate visualizations.
9. Build dashboard.
10. Generate report.

Features:

* Pipeline planning.
* Step-by-step preview.
* Dependency management.
* Pipeline execution.
* Pipeline logs.
* Pipeline versioning.
* Pipeline reuse.
* Pipeline export.
* Pipeline scheduling where supported.

Never automatically run destructive operations without approval.

## PHASE 19 â€” AI FORMULA ASSISTANT

Build a dedicated Excel formula assistant.

Features:

* Natural language to Excel formula.
* Formula explanation.
* Formula debugging.
* Formula optimization.
* Formula examples.
* Formula autocomplete.
* Function suggestions.
* Formula compatibility checks.
* Formula insertion.
* Formula testing where feasible.

Support:

* IF.
* IFS.
* SUM.
* SUMIF.
* SUMIFS.
* COUNTIF.
* COUNTIFS.
* XLOOKUP.
* VLOOKUP.
* INDEX/MATCH.
* FILTER.
* SORT.
* UNIQUE.
* TEXT.
* DATE.
* Dynamic array formulas where supported.

Detect workbook locale and formula compatibility.

Never assume that every Excel function is supported by every Excel version.

## PHASE 20 â€” EXCEL AUTOMATION ENGINE

Support safe workbook automation.

Features:

* Generate worksheets.
* Populate cells.
* Insert formulas.
* Create tables.
* Apply formatting.
* Insert charts.
* Generate KPI sections.
* Create summary sheets.
* Export analysis results.
* Build dashboard worksheets.

Use a structured action format.

Example action:

{
"action": "CREATE_WORKSHEET",
"parameters": {
"name": "Analysis Summary"
},
"requiresApproval": true
}

All actions must pass:

* Schema validation.
* Permission validation.
* Workbook-state validation.
* Range validation.
* Approval checks where required.
* Execution logging.

Provide a preview of all workbook modifications.

## PHASE 21 â€” REPORT GENERATOR

Create an AI-powered report generator.

Report types:

* Dataset profile report.
* Data cleaning report.
* EDA report.
* Statistical analysis report.
* Hypothesis testing report.
* Regression report.
* Machine learning report.
* Forecasting report.
* Business intelligence report.
* Executive summary.

Features:

* Report templates.
* Charts.
* Tables.
* Statistical findings.
* Methodology.
* Limitations.
* Recommendations clearly distinguished from measured findings.
* PDF export.
* Excel export.
* HTML export.

Every numerical result must come from the computation engine.

## PHASE 22 â€” PROJECT AND DATASET MANAGEMENT

Features:

* User projects.
* Dataset registry.
* Dataset metadata.
* Dataset versions.
* Analysis history.
* Saved queries.
* Saved transformations.
* Saved pipelines.
* Saved models.
* Saved dashboards.
* Saved reports.
* Project duplication.
* Project deletion.
* Project export.

Track data provenance and operation history.

## PHASE 23 â€” AUTHENTICATION AND AUTHORIZATION

Features:

* Registration.
* Login.
* Logout.
* Email verification.
* Password reset.
* Secure refresh tokens.
* Session management.
* Role-based access control.
* User profiles.
* Account settings.
* Project permissions.
* Dataset permissions.

Security:

* Password hashing.
* Secure HTTP-only cookies where appropriate.
* CSRF protection where applicable.
* Rate limiting.
* Input validation.
* CORS configuration.
* Security headers.
* Audit logging.

## PHASE 24 â€” SAAS SUBSCRIPTION AND USAGE MANAGEMENT

Design an extensible subscription system.

Potential plans:

* Free.
* Starter.
* Professional.
* Business.
* Enterprise.

Features:

* Usage quotas.
* AI token tracking.
* Dataset-size limits.
* Analysis-job limits.
* Storage limits.
* Model-training limits.
* Subscription management.
* Billing provider abstraction.
* Usage dashboards.
* Upgrade and downgrade workflows.

Do not hardcode pricing. Keep plan limits configurable.

Do not implement payment collection until the core product is functional.

## PHASE 25 â€” ADMIN DASHBOARD

Features:

* User management.
* Subscription management.
* Usage monitoring.
* AI token usage.
* Background job monitoring.
* Error monitoring.
* System health.
* Storage usage.
* Feature configuration.
* API provider configuration.
* Audit logs.
* Plan management.

Protect administrative functionality with strict authorization.

## PHASE 26 â€” BACKGROUND JOBS AND PERFORMANCE

Use BullMQ and Redis.

Background tasks:

* Large file ingestion.
* Data profiling.
* Data cleaning.
* Statistical computation.
* ML training.
* Forecasting.
* Report generation.
* Large exports.

Implement:

* Job progress.
* Job cancellation where safe.
* Retry policies.
* Failure handling.
* Dead-letter handling.
* Concurrency limits.
* Worker health.
* Resource monitoring.

Use worker threads or separate Node.js worker processes for CPU-intensive work.

Use streaming and DuckDB for large datasets.

Set configurable resource and execution limits.

## PHASE 27 â€” TESTING AND QUALITY ASSURANCE

Implement:

### Unit testing

* Vitest.
* Jest where justified.
* Core mathematical functions.
* Statistical methods.
* Transformation functions.
* Validation schemas.

### Integration testing

* API routes.
* Database repositories.
* Redis queues.
* AI tool orchestration.
* Dataset ingestion.
* Excel adapters.

### End-to-end testing

* Playwright.
* Web application workflows.
* Upload workflow.
* Analysis workflow.
* Dashboard workflow.
* Excel Add-in workflows where the testing environment supports them.

### Scientific correctness

Create deterministic test datasets with known expected results.

Test:

* Empty datasets.
* Missing values.
* Duplicate rows.
* Invalid values.
* Small samples.
* Large datasets.
* Constant columns.
* Zero-variance columns.
* Outliers.
* Imbalanced classes.
* Time-ordered data.
* Numerical precision.
* Edge cases for statistical tests.

Compare statistical implementations against trusted reference results or published test cases.

Document unsupported methods and numerical tolerances.

Do not mark a feature complete merely because the UI renders.

## PHASE 28 â€” SECURITY AND DATA PRIVACY

Implement:

* File validation.
* File size restrictions.
* Secure temporary storage.
* Data access controls.
* Tenant isolation.
* Encryption in transit.
* Appropriate encryption at rest.
* Secure secret management.
* Audit logs.
* Data deletion workflows.
* Upload scanning where appropriate.
* Rate limiting.
* Abuse prevention.
* Resource limits.
* Safe SQL execution.
* AI prompt injection defenses.

Do not send entire datasets to Gemini by default.

Use minimal required context, aggregated statistics and selected rows.

Make external AI data sharing transparent to users.

Provide local-only processing options for supported workflows.

Never log passwords, access tokens, private keys or raw sensitive datasets.

## PHASE 29 â€” DOCUMENTATION

Maintain:

* README.md
* Architecture overview.
* Installation instructions.
* Environment variables.
* API documentation.
* Database schema documentation.
* Module documentation.
* Statistical method documentation.
* ML algorithm documentation.
* Excel integration documentation.
* Deployment guide.
* Troubleshooting guide.
* Security documentation.
* Developer contribution guide.

Use Mermaid diagrams for major architecture and workflows.

---

# 6. USER INTERFACE DESIGN

Create a polished professional analytics application.

Visual direction:

* Modern data science workspace.
* Clean, professional layout.
* Responsive design.
* Light and dark modes.
* Accessible controls.
* Consistent spacing and typography.
* Clear charts and data tables.
* Minimal unnecessary decoration.

Main navigation:

1. Overview
2. AI Assistant
3. Datasets
4. Data Cleaning
5. Transformation
6. Explore Data
7. Statistics
8. Hypothesis Testing
9. Visualizations
10. Dashboards
11. Machine Learning
12. Deep Learning
13. Time Series
14. Anomaly Detection
15. Pipelines
16. Reports
17. Excel Integration
18. Settings

Excel Add-in task pane should provide a simplified interface optimized for the limited task-pane width.

Suggested Excel tabs:

* AI Chat
* Analyze
* Clean
* Visualize
* Formulas
* Actions
* History

Provide loading states, empty states, error states and success feedback.

---

# 7. DATA SCIENCE ENGINE DESIGN

Create independent computation interfaces.

Example:

interface DataEngine {
profile(datasetId: string): Promise<DatasetProfile>;
transform(input: TransformRequest): Promise<TransformResult>;
clean(input: CleaningRequest): Promise<CleaningResult>;
}

interface StatisticsEngine {
describe(input: StatisticsRequest): Promise<StatisticsResult>;
correlate(input: CorrelationRequest): Promise<CorrelationResult>;
hypothesisTest(input: HypothesisTestRequest): Promise<HypothesisTestResult>;
}

interface MachineLearningEngine {
train(input: TrainingRequest): Promise<TrainingResult>;
evaluate(input: EvaluationRequest): Promise<EvaluationResult>;
predict(input: PredictionRequest): Promise<PredictionResult>;
}

interface VisualizationEngine {
generate(input: ChartRequest): Promise<ChartConfiguration>;
}

Use these as conceptual contracts. Define concrete types and interfaces based on actual requirements.

Every engine must have:

* Input validation.
* Output validation.
* Error handling.
* Deterministic tests.
* Execution limits.
* Documentation.
* Version information where necessary.

Support multiple engine adapters without coupling the application to one library.

---

# 8. AI EXECUTION ARCHITECTURE

Follow this workflow:

USER REQUEST
|
v
INTENT DETECTION
|
v
DATASET / WORKBOOK CONTEXT
|
v
GEMINI PLANNER
|
v
STRUCTURED ACTION PLAN
|
v
ZOD VALIDATION
|
v
PERMISSION AND SAFETY CHECK
|
v
USER APPROVAL WHEN REQUIRED
|
v
DETERMINISTIC TOOL EXECUTION
|
v
COMPUTED RESULTS
|
v
GEMINI EXPLANATION
|
v
USER INTERFACE / EXCEL OUTPUT

Gemini is responsible for understanding and explaining.

The data engines are responsible for computing.

The approval system is responsible for controlling workbook changes.

Never allow Gemini to bypass these boundaries.

---

# 9. DEVELOPMENT RULES â€” EXTREMELY IMPORTANT

You must follow a feature-by-feature development process.

Do not attempt to implement all features in one response.

For every feature, follow this exact workflow:

STEP 1 â€” REQUIREMENT ANALYSIS

Explain:

* What the feature does.
* Why it is needed.
* User workflow.
* Dependencies.
* Technical requirements.
* Potential limitations.

STEP 2 â€” ARCHITECTURE

Explain:

* Frontend architecture.
* Backend architecture.
* Data flow.
* Database changes.
* Required libraries.
* Security considerations.

STEP 3 â€” FOLDER STRUCTURE

Show all new and modified files.

STEP 4 â€” IMPLEMENTATION

Provide complete working code.

Do not provide incomplete placeholders such as:

* TODO: implement this.
* Add your code here.
* Implement the remaining logic yourself.

If something genuinely requires a future phase, define the interface and document the dependency.

STEP 5 â€” TESTING

Provide:

* Unit tests.
* Integration tests where applicable.
* Manual testing instructions.
* Expected results.
* Edge cases.

STEP 6 â€” DOCUMENTATION

Update:

* README.
* Architecture documentation.
* API documentation.
* Feature documentation.

STEP 7 â€” VERIFICATION

Verify:

* TypeScript compilation.
* Linting.
* Tests.
* API behavior.
* Frontend behavior.
* Data correctness.
* Security considerations.

STEP 8 â€” COMPLETION REPORT

Provide:

* Implemented features.
* New files.
* Modified files.
* Dependencies added.
* Commands to run.
* Test results.
* Known limitations.
* Next phase.

STEP 9 â€” STOP

After completing one feature, STOP.

Wait for my explicit approval before implementing the next feature.

Do not automatically continue to the next phase.

---

# 10. CODING STANDARDS

Follow these rules throughout development:

1. Use TypeScript strict mode.
2. Use meaningful names.
3. Avoid unnecessary any types.
4. Use shared types.
5. Keep business logic outside controllers.
6. Keep database operations inside repositories.
7. Use services for orchestration.
8. Use Zod for validation.
9. Use centralized error handling.
10. Use structured logging.
11. Avoid duplicated logic.
12. Use dependency injection where it improves testability.
13. Write reusable components.
14. Keep frontend state predictable.
15. Use appropriate loading and error states.
16. Use pagination and streaming for large datasets.
17. Document complex algorithms.
18. Handle numerical edge cases.
19. Avoid unsafe dynamic code execution.
20. Never compromise data privacy for convenience.

Use established coding conventions rather than overengineering simple modules.

---

# 11. PERFORMANCE REQUIREMENTS

The application must be designed for datasets of different sizes.

Support configurable workload classes:

* Small datasets: in-memory processing.
* Medium datasets: optimized DataFrame operations.
* Large datasets: DuckDB, Arrow, streaming and background workers.

Do not promise a fixed maximum dataset size before benchmarking.

Measure:

* Processing time.
* Memory usage.
* Worker utilization.
* Query performance.
* Upload speed.
* AI latency.
* Chart rendering performance.

Implement cancellation, resource limits and progress reporting.

---

# 12. PRODUCT ACCEPTANCE CRITERIA

The product should eventually satisfy the following requirements:

* User can connect an Excel workbook.
* User can upload CSV and Excel files.
* User can inspect dataset structure.
* User can identify data-quality problems.
* User can clean data with preview and approval.
* User can transform datasets.
* User can run EDA.
* User can calculate statistical metrics.
* User can perform supported hypothesis tests.
* User can build interactive charts.
* User can create dashboards.
* User can train supported ML models.
* User can evaluate and compare models.
* User can perform supported time-series analysis.
* User can detect anomalies.
* User can use Gemini to plan analysis.
* User can generate reports.
* User can insert approved results into Excel.
* User can save and reopen projects.
* User can access a secure account.
* Administrators can monitor platform usage.

A feature is accepted only after its functionality and relevant tests pass.

---

# 13. STARTING INSTRUCTIONS

Before writing implementation code:

1. Read the complete specification.
2. Analyze the project requirements.
3. Identify technical risks.
4. Identify package compatibility issues.
5. Propose the initial architecture.
6. Propose the monorepo structure.
7. Explain the development roadmap.
8. List the dependencies required for Phase 1.
9. Identify the Microsoft Excel development requirements.
10. Identify the required environment variables.

Then begin with:

**PHASE 1 â€” PROJECT FOUNDATION**

Implement only the project foundation.

Do not begin Phase 2 until I explicitly approve Phase 1.

Your objective is not merely to generate code. Your objective is to build a maintainable, secure, reliable and commercially extensible AI-powered Data Science Studio.

Treat scientific correctness, data privacy, usability and maintainability as core product requirements.
