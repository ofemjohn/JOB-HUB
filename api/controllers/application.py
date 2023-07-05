from db.models import JobListing


# check if an application includes an email or link
def has_application_email_or_link(job_listing_id: int) -> bool:
    job_listing = JobListing.query.get(job_listing_id)
    return bool(job_listing.application_email or job_listing.application_link)
