function Analytics({ applications,funnelAnalytics,
  loading, }) {
  const total = applications.length;

  const applied = applications.filter(
    (application) =>
      application.status === "Applied"
  ).length;

  const interviews = applications.filter(
    (application) =>
      application.status === "Interview"
  ).length;

  const selected = applications.filter(
    (application) =>
      application.status === "Selected"
  ).length;

  const rejected = applications.filter(
    (application) =>
      application.status === "Rejected"
  ).length;


  function calculateRate(value) {
    if (total === 0) {
      return 0;
    }

    return Math.round(
      (value / total) * 100
    );
  }


  const interviewRate =
    calculateRate(interviews);

  const selectionRate =
    calculateRate(selected);

  const rejectionRate =
    calculateRate(rejected);


  const pipelineData = [
    {
      label: "Applied",
      value: applied,
    },
    {
      label: "Interview",
      value: interviews,
    },
    {
      label: "Selected",
      value: selected,
    },
    {
      label: "Rejected",
      value: rejected,
    },
  ];


  return (
    <div className="analytics-page">

      <section className="analytics-heading">
        <div>
          <p className="section-eyebrow">
            PERFORMANCE INSIGHTS
          </p>

          <h2>
            Application Analytics
          </h2>

          <p>
            Understand how your job search
            pipeline is performing.
          </p>
        </div>
      </section>


      <section className="analytics-metrics">

  <div className="analytics-card">
    <span>Total Applications</span>

    <strong>
      {loading
        ? "..."
        : funnelAnalytics?.total_applications ?? 0}
    </strong>

    <p>
      Opportunities tracked
    </p>
  </div>


  <div className="analytics-card">
    <span>Reached Interview</span>

    <strong>
      {loading
        ? "..."
        : funnelAnalytics?.interview_rate ?? 0}%
    </strong>

    <p>
      {
        funnelAnalytics?.reached_interview ?? 0
      } applications reached interviews
    </p>
  </div>


  <div className="analytics-card">
    <span>Selection Rate</span>

    <strong>
      {loading
        ? "..."
        : funnelAnalytics?.selection_rate ?? 0}%
    </strong>

    <p>
      {
        funnelAnalytics?.reached_selected ?? 0
      } applications reached selection
    </p>
  </div>


  <div className="analytics-card">
    <span>Interview → Selection</span>

    <strong>
      {loading
        ? "..."
        : funnelAnalytics
            ?.interview_to_selection_rate ?? 0}%
    </strong>

    <p>
      Conversion after reaching interview
    </p>
  </div>

</section>


      <section className="analytics-panel">

        <div className="analytics-panel-header">
          <div>
            <p className="section-eyebrow">
              PIPELINE DISTRIBUTION
            </p>

            <h3>
              Application Status
            </h3>
          </div>
        </div>


        <div className="pipeline-list">

          {pipelineData.map((item) => {

            const percentage =
              calculateRate(item.value);

            return (
              <div
                className="pipeline-item"
                key={item.label}
              >

                <div className="pipeline-info">

                  <span>
                    {item.label}
                  </span>

                  <strong>
                    {item.value}
                  </strong>

                </div>


                <div className="pipeline-track">

                  <div
                    className={`pipeline-fill pipeline-${item.label.toLowerCase()}`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>


                <span className="pipeline-percentage">
                  {percentage}%
                </span>

              </div>
            );
          })}

        </div>

      </section>

    </div>
  );
}

export default Analytics;