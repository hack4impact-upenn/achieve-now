/**
 * Interface for the coach data type return from the backend
 */

interface ICoach {
  _id: string;
  user_id: string;
  partner_site: string;
  mailing_address: string;
  media_waiver: boolean;
  progress_stats: { [type: string]: { [date: string]: string } };
  updates: string;
}

export default ICoach;
