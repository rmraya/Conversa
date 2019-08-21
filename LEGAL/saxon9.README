==============================

Saxon-HE 9.8 is the latest major release of the open-source edition of Saxon.
It is currently considered as the most stable and reliable release.
It is available for the Java and .NET platforms.

For Saxon-HE/C on the C++ platform please see: https://www.saxonica.com/download/c.xml

The current maintenance release is Saxon-HE 9.8.0.15.

The documentation for Saxon is at http://www.saxonica.com/documentation/
and includes a detailed list of changes for each release.

For the Java platform, download file SaxonHE9-8-0-15J.zip.
For the .NET platform, download file SaxonHE9-8-0-15N-setup.exe.

Installation instructions are at:

http://www.saxonica.com/documentation/index.html#!about/installationjava

The file saxon-resources9-8.zip contains documentation, sample files, test drivers and other miscellaneous resources. 
It is common to both platforms, and is not normally updated when new maintenance releases appear.

The file saxon9-8-0-15source.zip contains source code for both platforms; a new version is produced with each
maintenance release. Source code with the latest patches can also be obtained from a Subversion repository
maintained at https://dev.saxonica.com/repos/archive/opensource. The Subversion repository on the SourceForge site is no longer maintained.

The following bugs are cleared in 9.8.0.15, issued 2018-11-06 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Bug #3919: Saxon validation fails where Xerces succeeds
Bug #3923: Invalid result-document output in Saxon-HE-9.9.0-1
Bug #3925: Validation that succeeds under 9.8 fails under 9.9
Bug #3926: Stylesheet with saxon:threads="1" produces no output
Bug #3927: Multi-threading problems using Saxon-EE xsl:result-document with calls on last()
Bug #3931: The extension attribute xsl:result-document/@saxon:asynchronous is not recognized
Bug #3932: accumulator-before not working correctly with streaming and xsl:result-document in Saxon 9.9. EE
Bug #3935: command line catalog option
Bug #3936: xsl:call-template not executed under Saxon-EE
Bug #3937: Spurious warning from xsl:accumulator/@saxon:trace
Bug #3940: Streamable accumulator: value must be grounded
Bug #3941: Post-descent accumulator value not available within template rule for the matched element
Bug #3942: Duplicate component ID in generated SCM file
Bug #3943: fn:innermost() optimization not working
Bug #3956: Incorrect base URI for element nodes within a secondary result document
Bug #3965: fn:transform: saxon:schema-validation in vendor-options
Bug #3970: Parsing document {}, try {}, …
Bug #3974: Configuration options for generating bytecode
Bug #3979: Synchronization of xsl:message
Bug #3980: Incorrect type inference for map:merge() function
Bug #3983: strange behaviour of not in predicate
Bug #3984: Thread safety of index information held by KeyManager
Bug #3986: Applying a string-join(count(x)) expression in a root template completely crashes Saxon 9.9.0.1J
Bug #3992: Overriding a variable in a used package fails if neither variable has an explicit declared type
Bug #3993: Dynamic disabling of xsl:evaluate
Bug #3994: NullPointerException when using xsl:result-document
Bug #4001: unparsed-text-available(()) throws a type error
Bug #3838: Stack overflow in XSpec test driver
Bug #3858: Incorrect logic in LetExpression.optimize()
Bug #3859: Cannot run SEF file without a license
Bug #3861: Incorrect type checking when xsl:key contains sequence constructor in place of @use attribute
Bug #3862: Two expressions considered equal when the namespace context differs
Bug #3866: Failures running GitHub JSON test suite
Bug #3868: Unknown cardinality value 40960
Bug #3871: java.lang.IllegalStateException: saxon:assign binding has not been fixed up
Bug #3872: Mistake in error report returned from fn:collection()
Bug #3875: ClassCastException in streamability calculation
Bug #3878: Content of streamed comment node is corrupted
Bug #3880: XPathSelector.setURIResolver() does not work
Bug #3884: Saxon doesn't allow use of current-merge-group() call in user-defined function call inside of xsl:merge-action, gives error "XTDE3480: There is no current merge group"
Bug #3885: Performance regression from Saxon 9.1 to 9.8 (caused by space-stripping)
Bug #3887: Dynamic application of function conversion rules converts untypedAtomic to anyAtomicType incorrectly
Bug #3888: Incorrect streamability analysis for a map constructor
Bug #3889: No-namespace element copied without required xmlns="" declaration
Bug #3890: xpath-default-namespace on xsl:evaluate has no effect
Bug #3892: xsl:message fails if outputting a function item
Bug #3893: deep-equals() returns true comparing two sequences of arrays or maps if the first items are deep-equal
Bug #3894: Output properties item-separator and saxon:newline should not be whitespace-stripped
Bug #3895: Bad parent pointer in xsl:break
Bug #3896: SaxonDuration.addTo(Calendar)
Bug #3897: Default collation for xsl:evaluate
Bug #3898: Disable JAXP service provision
Bug #3901: Rule matching for text nodes using preconditions doesn't work correctly when streaming
Bug #3902: Regex non-greedy matching failure
Bug #3904: The -TP profile output truncates module names to the last 15 characters which might not be unique
Bug #3909: Schema for xpath-functions.xsd is incorrect
Bug #3911: fn:json-doc(): handling of characters illegal in XML
Bug #3912: fn:transform(): stylesheet-base-uri option is not used
Bug #3914: Error 3460 is not detected (xsl:apply-imports within xsl:override)
Bug #3915: Undetected error: with streaming, current-grouping-key() is available in a called template
Bug #3908: XQuery allows a context item to be supplied when it is already initialized in the query


The following bugs are cleared in 9.8.0.14, issued 2018-07-25 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Bug #3359: .NET XQuery: Unable to pass an external variable to XQueryEvaluator
Bug #3578: How to use XQuery and Serializer on .NET to output a map respectively how to ensure that output options in XQuery are used by Serializer
Bug #3729: NullPointerException when serialization parameter document includes character map
Bug #3770: Dynamic errors when evaluating a pattern used in streaming
Bug #3780: java.lang.RuntimeException: Internal error when adding a map to the final result tree
Bug #3781: ClassCastException when calling fn:serialize() with html-version=5
Bug #3784: The method SequenceExtent.effectiveBooleanValue() assumes the first item is a node or atomic value
Bug #3785: unparsed-text() fails to handle a surrogate pair that bridges two 2048-byte buffers
Bug #3786: XQuery reader fails to handle a surrogate pair that bridges two 2048-byte buffers
Bug #3787: Regex shouldn't match, but matches
Bug #3788: XQuery command line documentation still contains -pipe:(push|pull)
Bug #3789: Component reference variable is already bound, when compiling XSLT to SEF for Saxon-JS
Bug #3791: err:code can be dismissed by -opt:m?
Bug #3795: Broken javadoc links
Bug #3797: NPE in stylesheet compilation
Bug #3798: .NET API gives "java.lang.UnsupportedOperationException: An array does not have a string value" for XQueryEvaluator.Run method of XQuery returning an array while the Java API with XQueryEvaluator.run works
Bug #3799: Problems with trace listener and xsl:messages
Bug #3800: Expected external object of class java.net.URL, got class net.sf.saxon.value.AnyURIValue
Bug #3804: system-property('supports-backwards-compatibility')
Bug #3805: XQJ: effect of next() on a forwards-only XQResultSequence
Bug #3806: PullToStax (Saxon implementation of XMLStreamReader) returns repeated END_DOCUMENT events
Bug #3807: FeatureKeys.ALLOW_­EXTERNAL_­FUNCTIONS=false does not block external function calls anymore?
Bug #3810: parse-xml(())
Bug #3815: saxon:serialize evaluation problem when the optimizations are deactivated
Bug #3817: XPathCompiler.setBackwardsCompatible()
Bug #3818: Reflexive java functions vs byte arrays
Bug #3819: saxon:suppress-indentation works in Java but not .NET
Bug #3820: Hashcode for dateTime values with timezones
Bug #3822: Export code for (castable to list/union) expressions
Bug #3824: XdmMap does not properly implement java.util.Map
Bug #3826: java.lang.IllegalStateException: A LazySequence can only be read once
Bug #3832: Possibility to clear context items in net.sf.saxon.Controller after transformation (Saxon-HE)
Bug #3835: Saving a compiled XSL throws NullPointerException
Bug #3839: Problem with HTML5 indentation: <mark> not recognized as inline element
Bug #3840: Migrating from sourceforge saxon to Saxonica Saxon-EE, problem with sorting xslt
Bug #3843: Compiling an XPath expression takes 23 minutes
Bug #3849: ClassCastException: Literal cannot be cast to SlashExpression
Bug #3850: SortKeyDefinition.equals() is incorrect
Bug #3851: Method endReporting() in IInvalidityHandler should accept return of null
Bug #3852: No failure when fn:transform() requests streaming and streaming not available
Bug #3853: Round-tripping to PTree format fails with very large text node
Bug #3855: With multithreading xsl:for-each, threads are not closed properly after a dynamic error
Bug #3857: Saxon resources S9APIExamples sample failures


The following bugs are cleared in 9.8.0.12, issued 2018-05-09 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Bug #3654: Package export fails with call to load-xquery-module
Bug #3721: net.sf.saxon.tree.linked.ParentNodeImpl.insertChildren
Bug #3724: SQL extensions source
Bug #3725: Diagnostics from Apache catalog resolver
Bug #3728: Infinite recursion in optimizer (9.8.0.11 HE)
Bug #3730: NullPointerException processing xsl:message
Bug #3731: xsl:accumulator saxon:trace="yes" is not implemented for streaming accumulators
Bug #3732: Component reference function df:class#2 is already bound
Bug #3733: Bug in regexp matching when using '[/s/S]+'?
Bug #3735: Cannot compile ixsl:schedule-action using only wait attribute
Bug #3737: Tunnel parameter doesn't seem to be tunneled down the tree when streaming is used
Bug #3739: Allow ixsl:set-property with the empty sequence as the @select expression
Feature #3740: Disable elimination of unused variables
Bug #3742: Multithreading problem when validating result documents using xsi:schemaLocation
Support #3743: XQuery: Unexpected behavior in collection() function: specific file name extension required
Bug #3744: For ixsl:call() 3rd arg and ixsl:apply 2nd arg supplying function arguments, the empty sequence should not be allowed
Bug #3745: file:path-to-uri() fails or works incorrectly with relative path and UNC
Bug #3746: ClassCastException using fn:serialize() with html-version property
Bug #3748: Text value templates don't work as child of xsl:variable
Bug #3749: Unable to call function returned by a transformation
Bug #3751: Saxon can raise XQST0036 which was abolished in XQuery 3.0
Bug #3752: Templates with match="doc" and match="doc[true()]" have the same priority
Bug #3757: xs:numeric vs xs:_numeric_
Bug #3758: Saxon 9.8 position()'s "context" regression
Bug #3759: function-lookup() in XSLT should be scoped to the containing package
Bug #3760: package-name option in fn:transform()
Bug #3761: format-dateTime: formatting of named timezones
Bug #3762: Optimization of function calls assumes properties of the called function
Bug #3765: SwitchExpression is not streamable
Bug #3766: Atomizing arrays
Bug #3768: XQuery serialization parameters: precedence rules
Bug #3769: inconsistance string comparison with '='-operator when extracting value from document (only saxon ee 9.8)
Bug #3771: "instance of" test with XQuery function annotations is failing
Bug #3772: No static type error reported for dynamic function call
Bug #3773: Failure running XQuery switch expression with bytecode enabled
Bug #3774: Setting trace listeners modifies obtained output
Bug #3776: Failure to deduplicate result of path expressions involving user function calls
Bug #3777: Changes History section content improvements


The following bugs are cleared in 9.8.0.11, issued 2018-03-19 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Bug #3722: XPST0008 on 9.8.0.10: failure to resolve a forwards reference to a global variable in the select expression of a template xsl:param
Bug #3723: Problem with reflexive extension function using ?void=this and SEF files

The following bugs are cleared in 9.8.0.9 and 9.8.0.10, issued 2018-03-16 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Support #3647: Debugging out-of-memory issue with Saxon
Bug #3658: Trying to download latest .NET release 9.8.0.8 gives "Forbidden: You don't have permission to access /download/SaxonEE9-8-0-8N-setup.exe"
Bug #3665: ArrayIndexOutOfBounds in PrecedingSiblingIterator during schema validation
Bug #3669: format-number grouping separators - spec change between 2.0 and 3.0 not implemented
Bug #3672: Stack trace for dynamic errors omits function calls
Bug #3675: Invalid URI for stylesheet: <name>
Bug #3678: Configuration.buildDocumentTree() does not use local copies of W3C entity files
Feature #3680: Alphanumeric collation in Saxon-HE
Bug #3683: saxon:threads: XTDE0640: Attribute set invokes itself recursively
Bug #3684: saxon:threads does not take effect on sef?
Feature #3685: Allow Saxon-specific syntax for tuple types to be used in a portable way
Bug #3686: java.lang.UnsupportedOperationException: The string value of a function is not defined
Bug #3687: XPDY0002: The context item for axis step error("There is no context item") / a is absent
Bug #3688: QNames as arguments to memo functions
Bug #3690: NullPointerException when saxon:type-alias has no @type attribute
Bug #3691: Bad parent pointer error message
Bug #3694: Multithreading issue: Internal error: Cannot set local variable: no slot allocated
Bug #3695: When an expression is evaluated at compile time, the resulting literal may have no retainedStaticContext
Bug #3696: Documentation: Configuration.setDOMLevel() no longer exists
Bug #3698: SimpleTypeDefinition .... should have been resolved by now
Bug #3701: Type-checking on identity constraints in a schema is not working
Bug #3702: JIT compilation of template rules: if a static error is found during JIT analysis, subsequent transforms may crash
Bug #3703: Warning "Evaluation will always fail: there is no context item" with no location information
Bug #3706: Array out of bounds exception results from function in template predicate
Bug #3707: Poor optimization of path expression .//x in schema
Bug #3708: Serialization options ignored for XQuery update from command line
Bug #3709: Bad type-checking error message: "supplied value (trace) has item type..."
Bug #3712: Simple regular expression not matching when it should
Bug #3713: Incorrect type inference that element(foo) is a subtype of element(*:bar)
Bug #3714: deep-equal() masks dynamic errors evaluating its arguments
Bug #3715: Crash in LoopLifter during XSD assertion processing
Bug #3716: SCM export does not handle two element particles with the same name but different fixed values
Bug #3717: java.lang.AssertionError: Component reference function ... is already bound. Occurs when containing function is inlined.
Bug #3719: XSLT 3 with two templates with same priority matching a map or an array causes UnsupportedOperationException: map (respectively array) does not have a string value
Bug #3720: Static type inferencing handles empty arrays incorrectly
Bug #3668: Schema validation from a .scm file fails with ClassCastException when the schema contains xs:assert
Bug #3666: position filter in predicate


The following bugs are cleared in 9.8.0.8, issued 2018-02-05 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Bug #3025: absolute windows paths for command line option -catalog causes an error "Malformed URL"
Bug #3574: HTML 5.0 serialization: namespace prefixes
Bug #3576: JSON to XML to JSON, escaped characters
Bug #3577: XPST0008 Unknown type name (anonymous type appears in SEF file)
Bug #3579: Compiling an XQuery from a string where the query imports another module with an absolute URL works in Java but throws ArgumentNullException on .NET
Bug #3580: Problem with Serializer and method SerializeXdmValue closing underlying TextWriter
Bug #3581: XSLExpose has no effect under Saxon-HE
Bug #3582: Separator attribute of value-of ignored when streaming is used
Bug #3584: Streaming fallback for template rules should affect the whole mode or possibly the whole stylesheet
Bug #3585: Saxon 9.8 HE gives IllegalArgumentException when using -explain command line option
Bug #3588: LetExpression with side-effects is loop-lifted
Bug #3590: Supplying license programmatically in 9.8.0.7
Bug #3598: In PE/HE, setting optimization-level=10 causes NPE as a result of JIT template compilation
Bug #3601: XSLT 3 stylesheet trying to output array of arrays with output method 'json' works fine without streaming but gives error "JSON output method cannot handle a sequence of more than one item" with streaming
Bug #3602: Another streaming problem with map constructors
Bug #3603: ClassCastException using xsl:merge/@sort-before-merge="yes"
Bug #3606: Try/Catch and global-variable errors in fn:transform()
Bug #3607: A transform must have at least one of the following options: source-node|initial-template|initial-function"
Bug #3609: Regex capturing group ignored on .NET
Bug #3612: fn:transform() does not handle initial-match-selection option
Bug #3614: XSLT package-version should default to 1
Bug #3615: distinct-values() with case-blind collation
Bug #3616: fn:transform() caches compiled stylesheet when it depends on static parameters
Bug #3617: Inaccurate documentation for FeatureKeys.ALLOW_EXTERNAL_FUNCTIONS
Feature #3619: Support for streaming in fn:transform()
Bug #3621: ClassCastException: "net.sf.saxon.expr.parser.ContextItemStaticInfo cannot be cast to com.saxonica.ee.trans.ContextItemStaticInfoEE" when trying to run or at least analyze stylesheet using streamable function
Bug #3624: Setting vendor options on fn:transform()
Bug #3625: Bytecode generation for regular expression fails NoSuchMethodException
Bug #3627: Problem with Verifier for redistribution license key
Bug #3628: Type annotation for a complex type with simple content
Bug #3631: saxon:next-in-chain does not work with Saxon 9.8.0.7 if I try to get an output property before I run the transformation
Bug #3632: OutputURIResolver: close() method called supplying a Result that isn't from the same OutputURIResolver
Bug #3633: XQuery Update fails when byte code generation is on
Bug #3634: Compile-time stack overflow while optimizing FLWOR expression in XQuery
Bug #3635: passing stylesheet parameters via fn:transform causes an exception
Bug #3636: Obtaining the full context sequence
Bug #3645: java.lang.AssertionError: **** Component reference function df:class#2 is already bound
Bug #3649: Returning raw result from calling initial template
Bug #3650: saxon source zip missing data subdirectory
Bug #3651: Invalid "Type error" thrown during comparison
Bug #3652: Nested xsl:merge instructrions - test case merge-089
Bug #3653: Validation of namespace URIs and error XTDE0905
Bug #3655: ArrayIndexOutOfBounds in "ComplexContentOutputter.namespace"
Bug #3656: Wrong output from try/catch displaying $err:code
Bug #3575: EQName in pragma
Bug #3638: Child particle xs:invalidName
Bug #3062: Validation of element node ignores xsi:type attribute


The following bugs are cleared in 9.8.0.7, issued 2017-12-20 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Bug #3400: saxon:send-mail fails with NullPointerException if any configuration options are absent
Bug #3472: Somehow notify TraceListener that an empty xsl:template is being matched
Bug #3505: Whitespace around xsl:context-item
Bug #3508: Internal error evaluating template rule (involves xsl:next-match)
Bug #3509: Built-in template rules: on-no-match="deep-skip" applied to document nodes
Bug #3510: Incorrect Feature Key name in documentation
Bug #3514: Failures when run-time license differs from compile-time license
Bug #3515: [Saxon 9.8] Internal error when executing a .sef file compiled with -relocate:on
Bug #3516: saxon:docType instruction can be exported but not imported
Bug #3517: Array lookups, large indexes
Bug #3518: resolve-uri() gives incorrect result if base URI starts with "classpath:"
Bug #3520: Adding file attachments in saxon:send-mail()
Bug #3522: Built in template rule for arrays
Bug #3523: Static type checking on reflexive extension functions does not take ?void=this into account
Bug #3525: Reflexive extension function returning byte[]
Bug #3527: Another bug with XSD 4-field identity constraints
Bug #3533: Hotspot bytecode generation crashes under concurrent workload
Bug #3534: Simple map operator, fn:min
Bug #3536: IllegalStateException: A LazySequence can only be read once when trying to output sorted array of sequences with XQuery
Bug #3537: xsl:merge with xsl:merge-source having for-each-merge-source using accumulator not working with 9.8 HE when streamable attribute not present on accumulator and merge source
Bug #3538: Source code of TInyTree.getColumnNumber(...) looks strange. Bug?
Bug #3543: XdmNode.getColumnNumber() is always -1 for text and comment nodes.
Bug #3546: fn:remove, 2nd argument different to xs:integer
Bug #3547: Getting the configuration as a configuration property
Bug #3549: NullPointerException on erroneous stylesheet
Bug #3550: dateTime validation fails for fractional seconds
Bug #3552: fn:transform() assumes that if it's Saxon-HE then it doesn't support XSLT 3.0
Support #3554: Accessing StaticError InnerMessage property on .NET can give NullReferenceException
Feature #3556: Reinstate backwards compatibility mode in Saxon-HE
Bug #3559: On the Transform command line, the -nogo option does not force full static analysis
Bug #3562: Xslt30Transformer.setInitialTemplateParams() has no effect when streaming
Bug #3563: Pattern schema-element(ITEM)/AUTHOR is not motionless
Bug #3565: "XPST0008: Unknown type name" when an exported stylesheet references an anonymous type


The following bugs are cleared in 9.8.0.6, issued 2017-10-30 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Feature #3125: Duplicate conflicts when schema is read twice after building from NodeInfo
Bug #3396: Anonymous schema types in stylesheet export files
Feature #3418: Feature Request: Enhancements to XSD 1.1 : XPath 3.1, variables
Feature #3421: Implement xsl:global-context-item in Saxon-JS
Bug #3473: Xslt30Tranformer.applyTemplates(Source, Destination) attempts to build tree when Destination is a JSON Serializer
Support #3476: How to specify a SAXParserFactory without System.setProperty (or similar)?
Bug #3481: When schema validation is used, the whitespace stripping policy must be IGNORABLE
Bug #3483: XQueryCompiler is not thread-safe
Bug #3484: XMark Q11 runs slower with bytecode enabled
Bug #3487: Hash function for XSD identity constraints has poor worst-case performance
Bug #3489: Failure to compile bytecode for a simpleType that has a whiteSpace facet
Bug #3492: The command line option -dtd on the Transform command has no effect
Bug #3493: Warning "system cannot find file specified" of function document() has no location information.
Bug #3495: String-to-double conversion: "+NaN" is not being rejected
Bug #3497: AssertionError during XQuery compilation with a TraceListener
Bug #3503: Failure to export/re-import a reference to a system function in a namespace other than fn
Bug #3478: Stackoveflow in UserComplexType.getDescendantElementCardinality
Bug #3490: XSD identity constraints with exactly 4 fields will validate incorrectly:
Bug #3894: Documentation for FeatureKeys.OPTIMIZATION_LEVEL is out of date



The following bugs are cleared in 9.8.0.5, issued 2017-10-05 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :


Bug #3396: Anonymous schema types in stylesheet export files
Bug #3397: Streaming: Unsupported axis self in pattern
Bug #3399: Wrong output with streamed composite grouping and xsl:value-of outputting current-grouping-key() and aggregrated value of group
Bug #3403: Streaming identity transformation loses comment and pi nodes before the root element
Bug #3406: saxon:next-in-chain is silently ignored by the s9api Serializer, and therefore on the command line
Bug #3407: Configuration data for next-in-chain stylesheet
Bug #3408: Converting SpaceStrippedNode to DOM causes XPathException
Bug #3410: Instantiating TransformerFactoryImpl should force HE usage even if EE is available
Bug #3411: saxon:import-query failing (java.lang.AssertionError: Target of component reference function n:get-a#1 is undefined)
Bug #3412: Why TransformerException.getColumnNumber() is -1?
Bug #3415: Schema-aware transformation using -val on command line fails "When schema validation is used, the whitespace stripping policy must be IGNORABLE"
Bug #3426: No binding slot allocated for xsl:apply-templates call within xsl:override
Bug #3428: Streamed xsl:iterate fails to xsl:break when processing grounded consuming sequence
Bug #3429: Regular expression in fn:replace does not match (but should)
Bug #3432: Error running fn:transform() when TimingTraceListener is set
Bug #3433: Stack trace when using an attribute expansion template in xml:base
Bug #3434: EXPath archive:create-map doesn't honour compression level
Bug #3437: java.lang.RuntimeException - Internal error evaluating template rule
Bug #3438: java.lang.NullPointerException - net.sf.saxon.Controller.getInitialMode
Bug #3439: Crash (Invalid slot number) after calling higher-order function
Bug #3443: Performance degradation between 9.2 and 9.8
Bug #3444: IllegalStateException: local variable whose binding has been deleted, after eliminating common subexpressions in a pattern predicate
Bug #3445: Getting raw sequence result from Xslt30Transformer.CallTemplate
Bug #3449: match="$atomic" (test match-256) gives error but should simply not match
Bug #3450: Sorting a heterogeneous sequence
Bug #3451: Wrong line and column for errors in XSLT static expressions
Bug #3452: No AttributeName in error message for "as" attribute
Bug #3453: In error message, AttributeLocation getAttributeName() has the wrong value.
Bug #3455: Transform with -s:https://.... - fails "AugmentedSource not accepted"
Bug #3456: Minor inaccuracy in 9.8 documentation of file:write-text and file:append-text functions
Bug #3457: switch, xs:QName
Bug #3458: Putting SameNameTest in TypeHierarchy cache locks document into memory
Bug #3460: XQDY0025 (duplicate attribute) reported under XSLT (with docbook)
Bug #3464: Incorrect results for saxon:timestamp() under JDK 8
Bug #3465: Loop-lifting optimization can make code non-streamable
Bug #3466: Crashes in bytecode compiler masked by recovery code
Bug #3468: Using a static variable with a "select" attribute using the XPath 3.1 map syntax expression and an "as" attribute declaring "map(*)" in an XSLT 3.0 stylesheet results in error XPST0003
Bug #3469: Using Saxon EE with valid and recognized license, I get an error XPST0003
Bug #3471: Failure in XSLT test case tunnel-0207 when JIT is enabled
Bug #3398: Stylesheet runs in 25s on EE-9.5, takes 10hrs+ on EE-9.7 or EE-9.8
Bug #3343: -xi option applied to stylesheets and schemas as well as source documents
Bug #3332: XdmITem.GetStringValue() missing from .NET
Bug #3365: Context is lost if a trace listener is added
Bug #3368: java.lang.NumberFormatException thrown when creating XdmAtomicValues with a Decimal in .NET
Bug #3376: DecimalValue.Value and GetDecimalValue gives wrong value due to locale settings
Bug #3401: File Handle Leaks when a stylesheet module is included/imported more than once
Bug #3409: Crash in Xslt.cs when initialContextNode == null
Bug #3459: Calling XQuery-defined functions directly from Java: obsolete documentation
Bug #3467: Difference in evaluation between PE and EE (Saxon 9.7.0.20)
Bug #2726: Check for XQuery circular variable definitions is too strong

The following bugs are cleared in 9.8.0.4, issued 2017-08-16 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Bug #3314: Copying accumulator values before they have been evaluated
Bug #3333: Using an XSLT 3.0 package indirectly by several routes
Feature #3337: Byte code monitoring
Bug #3338: xsl:param override not working when initial mode is set
Bug #3340: NullPointerException in xsl:next-match with 9.8 match pattern ruleset optimization
Bug #3341: Visibility of components accepted from a used package
Bug #3342: XSLT 3.0 Error XTSE3051 not detected
Bug #3344: -pack option was dropped in 9.8 but still documented
Bug #3345: Problem with streamed group-by and calling avg(current-group()/@pop) resulting in FORG0001: ValidationException: Cannot convert string "" to double
Bug #3349: AssertionError thrown when FeatureKeys.MAX_COMPILED_CLASSES limit reached
Bug #3350: Define rules for parsing JSON with liberal=true
Bug #3351: ArrayIndexOutOfBoundsException with mutually-dependent streaming accumulators
Bug #3352: Tail call optimization of xsl:call-template not working in 9.8
Bug #3353: xsl:template match="$var" where $var is an atomic value
Bug #3354: Bad call on String.split in handling @mode attribute
Bug #3355: Imprecise location info for divide-by-zero error (bytecode enabled)
Bug #3356: fn:copy-of() and fn:snapshot() in XQuery
Feature #3357: Cannot create an XMLFilter from StreamingTransformerFactory
Bug #3358: AssertionError when a mode is used in more than one package
Bug #3364: Internal error: Cannot check template params before target template is compiled.
Bug #3366: Performance regression (9.6 - 9.8) building document using pull parser
Bug #3371: NullPointerException - streaming with a template rule that uses a predicate pattern
Bug #3372: Overriding a mode, with -export
Bug #3373: NullPointerException using -lib option on Transform command line with an incorrect file name
Bug #3382: Cannot compile convertUntyped: com.saxonica.ee.bytecode.ByteCodeCandidate cannot be cast to net.sf.saxon.expr.AtomicSequenceConverter
Bug #3384: Context item for attribute axis step says it's missing when it should not be
Bug #3388: Conversion of first argument of call to instance-level external method
Bug #3389: Performance regression: sorting nodes into document order
Bug #3390: Invalid expression tree after copying an xsl:merge instruction
Bug #3391: Streamed merge run on a stylesheet reloaded from a SEF file fails with NullPointerException
Bug #3392: With a reloaded package, error XTDE3052 is not reported
Bug #3395: Composite keys with -export
Support #3233: Unused local variable gets evaluated, causing an error
Bug #3287: Performance bottleneck in SequenceType
Bug #3346: IndexOutOfBoundsException constructing an error message
Bug #3348: Regression in Saxon 9.7 XSLT when normalizing namespaces on large XML
Bug #3359: .NET XQuery: Unable to pass an external variable to XQueryEvaluator
Bug #3360: Incorrect parsing of date/time with timezone offset -00:MM
Bug #3332: XdmITem.GetStringValue() missing from .NET
Bug #3365: Context is lost if a trace listener is added
Bug #3368: java.lang.NumberFormatException thrown when creating XdmAtomicValues with a Decimal in .NET
Bug #3376: DecimalValue.Value and GetDecimalValue gives wrong value due to locale settings


The following bugs are cleared in 9.8.0.3, issued 2017-07-06 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues :

Bug #3255: Streamed for-each-group group-starting-with gives wrong result
Bug #3293: NullPointerException with streamed for-each-group[group-by] on text nodes
Bug #3296: Merge key should be evaluated with a singleton focus
Bug #3298: Complexity and performance of streamed merging
Bug #3299: IndexOutOfRangeException in method Put of class XdmArray
Bug #3301: resolve-uri(): Confusing error message for invalid relative URI
Bug #3303: Default template applied unexpectedly (bug in common subexpression elimination)
Bug #3304: Streamable stylesheet function should fallback to non-streamed processing in Saxon-HE
Bug #3306: Choose/when: An empty sequence is not allowed...
Bug #3307: SequenceEnumerator property Current returns XdmEmptySequence
Bug #3310: Dead code for streamed grouping
Bug #3311: java.lang.AssertionError: No current component using packages with a function having streamability="filter"
Bug #3312: Shallow-descent streamable functions should allow second argument to be consuming
Bug #3313: Streaming for-each-group with test="not(current-group()[2])"
Bug #3315: NotImplementatedException in MakeValue with string argument
Bug #3316: "Bad parent pointer" after simplifying nested blocks.
Bug #3317: <xsl:output method=""/> raises java.lang.StringIndexOutOfBoundsException
Bug #3319: <xsl:sequence select="accumulator-after()"/>
Bug #3320: InvalidCastException: Unable to cast object of type XdmAtomicValue to type AtomicValue
Bug #3322: Incorrect group-starting-with= behaviour in HE9.8
Bug #3324: Consuming primary input twice with Saxon HE does not work
Bug #3325: NullPointerException with absorbing user-defined recursive function using xsl:for-each-group group-starting-with
Bug #3326: XTDE1061: There is no current group in Saxon-HE-9.8.0-2
Bug #3329: XQuery version declaration is rejected XQST0031
Bug #3330: A Saxon-PE license enables higher-order functions in XSLT and in XPath, but not in XQuery
Bug #3334: NullPointerException during loop-lifting optimization
Bug #3339: Javadoc out of date link for DOM4J
Bug #3068: Cannot output a namespace node for the default namespace when the element is in no namespace
Bug #2112: Optimize positional predicates in patterns such as match="*[position() mod 2 = 1]"



The following bugs are cleared in 9.8.0.2, issued 2017-06-21 (this includes bugs that appear only in the commercial
versions of the product). Bugs are listed under the number used on the new Saxonica Community site at
https://saxonica.plan.io/projects/saxon/issues. :

Bug #3249: Incorrect documentation regarding XSLT 3.0 support in 9.8
Bug #3251: Possible error in XSLT when choosing overloaded method in reflexive function
Bug #3252: 9.8.0-1J HE - categories.xml cannot be read
Bug #3253: java.lang.ClassCastException: net.sf.saxon.expr.parser.ContextItemStaticInfo cannot be cast to com.saxonica.ee.trans.ContextItemStaticInfoEE when trying to compile/run stylesheet with recursive function and streamability="absorbing"
Bug #3255: Streamed for-each-group group-starting-with gives wrong result
Bug #3257: Crash in xsl:iterate - Internal error: no value for variable $word at line 27 of .....xsl
Bug #3259: http://saxonica.com/html/documentation/xsl-elements/merge.html presents two xsl:merge examples which use the current-group() function
Bug #3260: Sequence size incorrecly reported as 50
Bug #3263: saxon:transform() returns xs:boolean
Bug #3264: XTSE0550 for @mode tokens with multiple spaces
Bug #3265: Export failure: no retained static context
Bug #3266: First argument of fn:doc-available is xs:string; supplied value has item type xs:anyURI
Bug #3274: Poor diagnostics when attempting to call higher-order function under Saxon-HE
Bug #3277: There is no "command" element in HTML5
Bug #3278: Version warning message is no longer required
Bug #3279: Query evaluation continues though positional filter can no longer be satisfied
Bug #3280: Regression on XQuery streaming
Bug #3281: Getting wrong result when using streaming with for-each-group group-by and map variable inside to collect some data from current group
Bug #3282: Getting wrong result when using streaming with for-each-group group-by and nested xsl:fork to collect some data from current group
Bug #3283: 9.8.0.1N HE - categories.xml cannot be read
Bug #3284: xsl:number throws "Bad parent pointer found in..." message
Bug #3285: com.saxonica.pull package missing from source distribution
Feature #3291: Request for switch to suppress XPath warnings
Bug #3292: Documentation for TagSoup
Bug #3250: collection() with on-error=ignore stops after the first failure (with no error)
Bug #3254: Documentation error in 9.8.0.1 for xsl:mode (shallow copy)
Bug #3258: Predicate [not(self::pb)] on current-group() not working with streaming and for-each-group group-ending-with
Bug #3261: Duplicate binding slot assignment
Bug #3262: Problems validating XSLT with Saxon JS extensions using elements factory from "com.saxonica.ee.extfn.js"
Bug #3269: NullPointerException using absent extension instruction with xsl:fallback
Bug #3270: NullPointerException with missing xsl:namespace-alias/@stylesheet-prefix
Bug #3272: NullPointerException when xsl:key has no @name attribute
Bug #3287: Performance bottleneck in SequenceType
Bug #3290: Using key#3 with composite key - third argument ignored
Bug #3294: Thread contention on LRUCache.get


The first release in this series, 9.8.0.1, was issued on 8th June 2017.

Bugs can be reported, and known bugs inspected, on the Saxon community site at https://saxonica.plan.io/projects/saxon
The sourceforge bug tracker is no longer maintained.