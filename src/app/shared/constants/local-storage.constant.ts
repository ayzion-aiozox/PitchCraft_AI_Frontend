export class LocalStorageConstant {
  /** JWT sent in Authorization header */
  static readonly Token = 'Token';
  static readonly RefreshToken = 'refreshToken';
  static readonly ExpiresAt = 'expiresAt';
  static readonly UserId = 'UserId';
  static readonly User = 'User';
  static readonly WorkspaceId = 'WorkspaceId';
  /** Qdrant collection id for current workspace (from login user payload) */
  static readonly QdrantCollectionId = 'QdrantCollectionId';
}
