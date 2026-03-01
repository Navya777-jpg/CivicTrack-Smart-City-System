import db from "../db.js";

export const getAdminIssues = (req: any, res: any) => {
  const issues = db.prepare(`
    SELECT issues.*, users.name as userName 
    FROM issues 
    JOIN users ON issues.userId = users.id 
    ORDER BY createdAt DESC
  `).all();
  res.json(issues);
};

export const updateIssueStatus = (req: any, res: any) => {
  const { status, remarks, priority } = req.body;
  db.prepare(`
    UPDATE issues 
    SET status = COALESCE(?, status), 
        remarks = COALESCE(?, remarks), 
        priority = COALESCE(?, priority),
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, remarks, priority, req.params.id);
  
  const issue: any = db.prepare("SELECT userId FROM issues WHERE id = ?").get(req.params.id);
  db.prepare("INSERT INTO notifications (userId, message) VALUES (?, ?)").run(
    issue.userId,
    `Your issue #${req.params.id} status updated to ${status}`
  );
  
  res.json({ message: "Issue updated" });
};

export const getAnalytics = (req: any, res: any) => {
  const total = db.prepare("SELECT COUNT(*) as count FROM issues").get() as any;
  const resolved = db.prepare("SELECT COUNT(*) as count FROM issues WHERE status = 'resolved'").get() as any;
  const pending = db.prepare("SELECT COUNT(*) as count FROM issues WHERE status = 'pending'").get() as any;
  const inProgress = db.prepare("SELECT COUNT(*) as count FROM issues WHERE status = 'in-progress'").get() as any;
  
  // Calculate average resolution time
  const resolvedIssues = db.prepare("SELECT createdAt, updatedAt FROM issues WHERE status = 'resolved'").all() as any[];
  let avgTimeHours = 0;
  if (resolvedIssues.length > 0) {
    const totalHours = resolvedIssues.reduce((acc, issue) => {
      const start = new Date(issue.createdAt).getTime();
      const end = new Date(issue.updatedAt).getTime();
      return acc + (end - start) / (1000 * 60 * 60);
    }, 0);
    avgTimeHours = Math.round(totalHours / resolvedIssues.length);
  }

  const categories = db.prepare("SELECT category, COUNT(*) as count FROM issues GROUP BY category").all();
  const locationStats = db.prepare("SELECT location, COUNT(*) as count FROM issues GROUP BY location ORDER BY count DESC LIMIT 5").all();
  const recentIssues = db.prepare("SELECT issues.*, users.name as userName FROM issues JOIN users ON issues.userId = users.id ORDER BY createdAt DESC LIMIT 5").all();

  res.json({
    total: total.count,
    resolved: resolved.count,
    pending: pending.count,
    inProgress: inProgress.count,
    avgTimeHours: avgTimeHours || 24,
    categories,
    locationStats,
    recentIssues
  });
};
