import QuizRole from "./models/QuizRole";

export enum Permission {
  VIEW_RESULTS = 'view_results',
  EDIT_QUIZ = 'edit_quiz',
  DELETE_QUIZ = 'delete_quiz',
  MANAGE_ROLES = 'manage_roles',
  CONFIGURE_ACCESS = 'configure_access',
  SEND_INVITATIONS = 'send_invitations',
  VIEW_ANALYTICS = 'view_analytics',
  TAKE_QUIZ = 'take_quiz',
}

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  creator: [
    Permission.VIEW_RESULTS,
    Permission.EDIT_QUIZ,
    Permission.DELETE_QUIZ,
    Permission.MANAGE_ROLES,
    Permission.CONFIGURE_ACCESS,
    Permission.SEND_INVITATIONS,
    Permission.VIEW_ANALYTICS,
    Permission.TAKE_QUIZ,
  ],
  teacher: [
    Permission.VIEW_RESULTS,
    Permission.EDIT_QUIZ,
    Permission.SEND_INVITATIONS,
    Permission.VIEW_ANALYTICS,
    Permission.TAKE_QUIZ,
  ],
  monitor: [
    Permission.VIEW_RESULTS,
    Permission.VIEW_ANALYTICS,
  ],
  student: [
    Permission.TAKE_QUIZ,
  ],
};

export async function checkQuizPermission(
  userId: string,
  quizId: string,
  requiredPermission: Permission
): Promise<boolean> {
  try {
    const roleDoc = await QuizRole.findOne({ quizId, userId });
    
    if (!roleDoc) {
      return false;
    }
    
    const permissions = ROLE_PERMISSIONS[roleDoc.role];
    return permissions?.includes(requiredPermission) || false;
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}
