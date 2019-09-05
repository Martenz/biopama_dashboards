# BIOPAMA Dashboards

Drupal8 custom module name: **biopama_dashboards**

JRC BIOPAMA Dashboards Module


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
