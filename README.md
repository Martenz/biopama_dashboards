# BIOPAMA Dashboards

Drupal8 custom module name: **biopama_dashboards**

JRC BIOPAMA Dashboards Module will install the following items:

**Content Types**

>>  ...

**Taxonomies**

>> biopama_dashboards

    * BIOPAMA LandingPage
    * BIOPAMA PA Dashboard
    * ...

>> biopama_dashboards_section

    * Content
    * ...

**Views**

/BPMLP_page_landingpage
/BPMLP_PA_dashboard

/BPMLP_page_pame
/BPMLP_page_pame_tools
/BPMLP_page_pame_assessments
/BPMLP_page_pame_resources
/BPMLP_page_pame_management

Use Drupal URL Alias to replace those paths to your desired urls.

---------------------
Note:

If you change the default path of the "Page" view (machine name: BMPLP_page_landingpage)
you have to cheange also the suggestion in the .module file to 

  'page__<path>' => [
        'base hook' => 'page',
      ],
  
and duplicate the default twig template to

   page-<path>.html.twig
   (use - insthead of _)
