import UpdateEnrollmentMutation from 'mutations/UpdateEnrollmentMutation'

export function toggleEnrollment(isEnrolled, enrollableId, callback) {
  if (isEnrolled) {
    UpdateEnrollmentMutation(
      enrollableId,
      "UNENROLLED",
      callback,
    )
  } else {
    UpdateEnrollmentMutation(
      enrollableId,
      "ENROLLED",
      callback,
    )
  }
}
