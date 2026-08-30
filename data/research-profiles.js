// Research classifications and undergraduate-research starting points.
// US classifications use the 2025 Carnegie Basic Classification; Canadian
// institutions use the U15 designation, which is not a Carnegie equivalent.
const CARNEGIE = 'https://carnegieclassifications.acenet.edu/';

const r1 = (opportunities, url) => ({ level: 'Carnegie R1 — very high research activity', levelSource: 'Carnegie Classification (2025)', levelUrl: CARNEGIE, opportunities, opportunitySource: 'Official undergraduate research office', opportunityUrl: url });
const r2 = (opportunities, url) => ({ level: 'Carnegie R2 — high research activity', levelSource: 'Carnegie Classification (2025)', levelUrl: CARNEGIE, opportunities, opportunitySource: 'Official undergraduate research office', opportunityUrl: url });
const u15 = (opportunities, url) => ({ level: 'U15 Canadian research university', levelSource: 'U15 Group of Canadian Research Universities', levelUrl: 'https://u15.ca/', opportunities, opportunitySource: 'Official undergraduate research office', opportunityUrl: url });

module.exports = {
  'binghamton-university': r1('Faculty-mentored projects, research courses, summer programs, and presentation funding.', 'https://www.binghamton.edu/research/'),
  'boston-university': r1('Paid and volunteer research placements, summer programs, and faculty-project matching through UROP.', 'https://www.bu.edu/urop/'),
  'case-western-reserve-university': r1('Research placements, funding, and summer programs coordinated through SOURCE.', 'https://case.edu/source/'),
  'cornell-university': r1('Faculty labs, independent study, summer research, grants, and presentation opportunities.', 'https://undergraduateresearch.cornell.edu/'),
  'drexel-university': r1('Faculty research, co-op-linked projects, fellowships, and conference support through UREP.', 'https://drexel.edu/pennoni/urep/'),
  'indiana-university-bloomington': r1('Research mentoring, fellowships, and project opportunities across IU Bloomington.', 'https://crimson.iu.edu/'),
  'mcgill-university': u15('Faculty-supervised research courses, summer awards, and research placements across departments.', 'https://www.mcgill.ca/research/'),
  'new-york-university': r1('Faculty research, summer programs, grants, and research showcases across NYU schools.', 'https://www.nyu.edu/students/undergraduate-research.html'),
  'northwestern-university': r1('Faculty-mentored research, summer funding, grants, and the Undergraduate Research & Arts Exposition.', 'https://undergradresearch.northwestern.edu/'),
  'penn-state-university-park': r1('Faculty projects, summer research, grants, and a university-wide undergraduate research exhibition.', 'https://undergradresearch.psu.edu/'),
  'princeton-university': r1('Independent work, faculty research, summer projects, and funded senior theses are central options.', 'https://odoc.princeton.edu/curriculum/undergraduate-research'),
  'rochester-institute-of-technology': r2('Faculty lab work, paid research, summer programs, and research-symposium presentation opportunities.', 'https://www.rit.edu/research/'),
  'rutgers-university-new-brunswick': r1('Aresty Research Center offers faculty matching, research courses, summer programs, and grants.', 'https://aresty.rutgers.edu/'),
  'the-ohio-state-university': r1('Research grants, faculty mentoring, summer programs, and the annual undergraduate research forum.', 'https://undergraduateresearch.osu.edu/'),
  'tufts-university': r1('Faculty research, summer scholars programs, grants, and research presentation support.', 'https://students.tufts.edu/'),
  'university-at-buffalo': r1('Faculty-mentored projects, research fellowships, summer opportunities, and presentation support.', 'https://www.buffalo.edu/undergrad-research.html'),
  'university-of-british-columbia': u15('Faculty labs, research-based courses, work-learn roles, and summer undergraduate research awards.', 'https://students.ubc.ca/'),
  'university-of-california-berkeley': r1('Faculty mentorship, summer research programs, research apprenticeships, and SURF funding.', 'https://surf.berkeley.edu/'),
  'university-of-california-davis': r1('Faculty research, research programs, internships, grants, and an undergraduate research conference.', 'https://urc.ucdavis.edu/'),
  'university-of-california-san-diego': r1('Lab placements, faculty mentorship, research scholarships, and undergraduate research conferences.', 'https://undergradresearch.ucsd.edu/'),
  'university-of-chicago': r1('Faculty research, paid summer opportunities, grants, and research through the College Center for Research and Fellowships.', 'https://college.uchicago.edu/academics/'),
  'university-of-iowa': r1('Faculty projects, research fellowships, grants, and undergraduate research festivals.', 'https://ugradresearch.uiowa.edu/'),
  'university-of-maryland-college-park': r1('UROP offers faculty research placement, research courses, grants, and symposium presentation.', 'https://urop.umd.edu/'),
  'university-of-massachusetts-amherst': r1('Faculty research, grants, summer experiences, and undergraduate research conference support.', 'https://www.umass.edu/ours/'),
  'university-of-pittsburgh': r1('Faculty research, research fellowships, summer programs, and presentation opportunities.', 'https://www.asundergrad.pitt.edu/research'),
  'university-of-rochester': r1('Faculty-mentored research, summer fellowships, grants, and research presentation opportunities.', 'https://www.rochester.edu/college/ugresearch/'),
  'university-of-toronto': u15('Research courses, faculty-supervised projects, summer programs, and department-based research opportunities.', 'https://www.artsci.utoronto.ca/current/experience-opportunities/research'),
  'university-of-wisconsin-madison': r1('Faculty labs, research courses, grants, summer programs, and the undergraduate symposium.', 'https://undergraduateresearch.wisc.edu/'),
  'wesleyan-university': { level: 'Research college/university (Carnegie research classification)', levelSource: 'Carnegie Classification (2025)', levelUrl: CARNEGIE, opportunities: 'Faculty-supervised research, summer fellowships, academic-year grants, and thesis work.', opportunitySource: 'Official Center for Global Studies research information', opportunityUrl: 'https://www.wesleyan.edu/cgs/' },
  'william-and-mary': r2('Faculty mentoring, research grants, summer programs, and presentation at the annual symposium.', 'https://www.wm.edu/as/charlescenter/'),
  'yale-university': r1('Faculty research, fellowships, summer funding, research travel support, and the annual symposium.', 'https://urp.yale.edu/'),
};
