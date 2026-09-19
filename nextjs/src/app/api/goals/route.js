import connectDB from "@/lib/db";
import { Goal } from "@/models/Goal";
import { Task } from "@/models/Task";
import { verifyAuth, handleApiError } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "active";

    const allUserGoals = await Goal.find({ userId }).sort({ createdAt: -1 });

    let totalMilestonesCount = 0;
    let completedMilestonesCount = 0;

    const enrichedAll = allUserGoals.map(doc => {
      const g = doc.toObject();
      const totalM = g.milestones?.length || 0;
      const completedM = g.milestones?.filter(m => m.completed)?.length || 0;
      const progress = totalM > 0 ? Math.round((completedM / totalM) * 100) : (g.progress || 0);

      totalMilestonesCount += totalM;
      completedMilestonesCount += completedM;

      // Dynamic momentum calculation
      let momentum = g.momentum || "Steady";
      if (completedM > 0) momentum = "Accelerating";
      else if (progress > 0) momentum = "Strong";

      return {
        ...g,
        progress,
        momentum,
        consistency: g.consistency || 100,
        milestones: (g.milestones || []).map(m => ({
          ...m,
          status: m.completed ? "completed" : "pending",
          completed: !!m.completed,
          proof: {
            proofUrl: m.proofUrl || "",
            proofType: m.proofType || "image",
            proofText: m.proofText || ""
          }
        }))
      };
    });

    // Filter goals based on status
    let filteredGoals = enrichedAll;
    if (status === "active") {
      filteredGoals = enrichedAll.filter(g => g.status === "active" && g.progress < 100);
    } else if (status === "completed") {
      filteredGoals = enrichedAll.filter(g => g.status === "completed" || g.progress === 100);
    } else if (status === "paused") {
      filteredGoals = enrichedAll.filter(g => g.status === "paused");
    }

    const stats = {
      totalGoals: enrichedAll.length,
      activeGoals: enrichedAll.filter(g => g.status === "active" && g.progress < 100).length,
      completedGoals: enrichedAll.filter(g => g.status === "completed" || g.progress === 100).length,
      milestonesAchieved: completedMilestonesCount,
      totalMilestones: totalMilestonesCount,
      avgVelocity: totalMilestonesCount > 0 ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100) : 0
    };

    return Response.json({ goals: filteredGoals, stats }, { status: 200 });
  } catch (error) {
    return handleApiError(error, "Goals GET Route");
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { userId } = await verifyAuth(req);
    const body = await req.json();

    if (!body.title) {
      return Response.json({ message: "Goal title is required" }, { status: 400 });
    }

    if (body.isPrimary) {
      await Goal.updateMany({ userId, isPrimary: true }, { isPrimary: false });
    }

    const rawMilestones = body.milestones || [];
    const formattedMilestones = rawMilestones.map(m => {
      if (typeof m === "string") {
        return { title: m, completed: false, targetWeeks: 2, keyDeliverable: "" };
      }
      return {
        title: m.title || "Milestone",
        description: m.description || "",
        targetWeeks: m.targetWeeks || m.estimatedWeeks || 2,
        keyDeliverable: m.keyDeliverable || m.deliverable || "",
        targetDate: m.targetDate ? new Date(m.targetDate) : null,
        completed: !!m.completed
      };
    });

    const totalEstimatedWeeks = formattedMilestones.reduce((acc, m) => acc + (m.targetWeeks || 2), 0);
    const estimatedCompletionDate = new Date(Date.now() + (totalEstimatedWeeks || 6) * 7 * 24 * 60 * 60 * 1000);

    const goal = await Goal.create({
      userId,
      title: body.title,
      description: body.description || "",
      category: body.category || "Career",
      motivation: body.motivation || "",
      deadline: body.deadline ? new Date(body.deadline) : null,
      startingState: body.startingState || "Initiation baseline",
      currentState: "In progress execution",
      targetState: body.targetState || body.title,
      measurableMetrics: body.measurableMetrics || [],
      milestones: formattedMilestones,
      weeklyTargets: body.weeklyTargets || [],
      starterDailyTasks: body.starterDailyTasks || [],
      aiInsight: body.aiInsight || "",
      isPrimary: !!body.isPrimary,
      progress: 0,
      momentum: "Steady",
      consistency: 100,
      riskLevel: "Low",
      estimatedCompletionDate
    });

    // Automatically create starter tasks if provided
    if (body.starterDailyTasks && Array.isArray(body.starterDailyTasks)) {
      const taskDocs = body.starterDailyTasks.map((taskItem, i) => {
        const title = typeof taskItem === "string" ? taskItem : (taskItem.title || `Starter Action ${i + 1}`);
        const timeBlockMinutes = typeof taskItem === "object" ? (taskItem.timeBlockMinutes || 30) : 30;
        return {
          userId,
          goalId: goal._id,
          title,
          category: goal.category,
          timeBlockMinutes,
          status: "pending"
        };
      });

      if (taskDocs.length > 0) {
        await Task.insertMany(taskDocs);
      }
    }

    return Response.json({ goal, message: "Goal trajectory created successfully" }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "Goals POST Route");
  }
}
